import math
CONST_NUM_TIMESLOT = 48*7
def smoother(numtype_arr):
    """
    reflect neighboring timeslot's score.
    """

    result_arr = [0] * len(numtype_arr)
    window = [0.1, 0.5, 1, 0.5, 0.1] # weight for neighbor.
    sum_window = sum(window)
    for idx in range(len(numtype_arr)):
        weighted_sum = 0;

        window_one_side_len = len(window)/2;

        for offset in range( - window_one_side_len, window_one_side_len + 1):
            weighted_sum = weighted_sum + window[offset + window_one_side_len] * numtype_arr[(idx + offset) % len(numtype_arr)]

        result_arr[idx] = weighted_sum / sum_window;
    return result_arr

def getTimePrefScore(user_id, token_collection, tokens):
    """
    return average of scaled tf score for each token.
    The scaled tf score is in [0, 1].
    tf score = tf_timeslot * tf_weekday
    
	During calculation, it use only tokens belong to given user_id.
    """
    import datetime

    # Init tf-idf score for every timeslot per each token.
    # score_lookup_table[i][j] : tf-idf score for tokens[i] at timeslot[j]
    score_lookup_table = []
    for token in tokens:
        score_lookup_table.append([0] * CONST_NUM_TIMESLOT)
        
    unknown_tokens = []

    for index_token, token in enumerate(tokens):
        # For each token, calculate its tf-idf score for every timeslot.

        # num_tok_timeslot[i]: number of tokens appeared in timeslot i.
        num_tok_daytime = [0] * 48
        num_tok_weekday = [0] * 7        

        # type:200, 9999 only retrive tokens for task-ongoing event or Google Calander event.
        for pred_token in token_collection.find({"userId": user_id, "text": token, "$or": [{"type": 200}, {"type": 9999}]}):            
            if pred_token["weekday"] != -1:                
                num_tok_weekday[pred_token["weekday"]] += 1
            if pred_token["daytime"] != -1:
                num_tok_daytime[pred_token["daytime"]] += 1

        
        num_used_daytime = sum(x>0 for x in num_tok_daytime)
        
        if num_used_daytime == 0:
            unknown_tokens.append(token)
            continue

                
        for index_timeslot in range(CONST_NUM_TIMESLOT):
            # tf score for every timeslot.            
            daytime = index_timeslot%48
            weekday = index_timeslot/48            
            
            score_lookup_table[index_token][index_timeslot] = math.log(num_tok_weekday[weekday] * num_tok_daytime[daytime] + 1)
            
        score_lookup_table[index_token] = smoother(score_lookup_table[index_token])
        
        # Scaling
        max_val = max(score_lookup_table[index_token])
        score_lookup_table[index_token] = [float(x)/max_val for x in score_lookup_table[index_token]]
        
    # Get tokens' total score from each token's score.    
    # Below code get average of all tokens.
    total_score = [0] * CONST_NUM_TIMESLOT
    
    for index_timeslot in range(CONST_NUM_TIMESLOT):
        num_token = 0
        score = 0

        for index_token, token in enumerate(tokens):        
            if token in unknown_tokens:
                continue
            else:
                num_token += 1
                score += score_lookup_table[index_token][index_timeslot]              
        
        if num_token != 0:
            total_score[index_timeslot] = float(score) / num_token # This is average                
            
    return total_score