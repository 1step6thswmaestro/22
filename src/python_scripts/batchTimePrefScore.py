#!usr/bin/python
# -*- coding: utf-8 -*-


# Please change below DB Address only when you schedule regular job with cron.
# CONST_DB_ADDR='128.199.166.149'
CONST_DB_ADDR='172.16.101.172' # MacPro DB
CONST_DB_PORT=27340

CONST_NUM_TIMESLOT = 48*7
DEBUG = False

import math
import presetScore

def log(var, indent = 0):
    if DEBUG == False:

        return
    import json
    space = ' ' * indent;
    print space, json.dumps(var, ensure_ascii=False)

def getTimeSlotScore(num_tok_weekday, num_tok_daytime, factor_daypropagation=0.1, factor_smooth=1, scale=True):
    '''
    From token occurence frequency over weekdays and daytime, return score over timeslot.
    The scaled tf score is in [0, 1].

    tf score = tf_timeslot * tf_weekday (Rough Idea. See code for detail)

    '''
    def smoother(numtype_arr, factor_smooth):
        """
        make smooth score change with neighboring timeslot value
        """

        result_arr = [0] * len(numtype_arr)
        window = [0.1*factor_smooth, 0.5*factor_smooth, 1, 0.5*factor_smooth, 0.1*factor_smooth] # weight for neighbor.
        sum_window = sum(window)
        for idx in range(len(numtype_arr)):
            weighted_sum = 0;

            window_one_side_len = len(window)/2;

            for offset in range( - window_one_side_len, window_one_side_len + 1):
                weighted_sum = weighted_sum + window[offset + window_one_side_len] * numtype_arr[(idx + offset) % len(numtype_arr)]

            result_arr[idx] = weighted_sum / sum_window;
        return result_arr


    score = [0] * CONST_NUM_TIMESLOT
    for index_timeslot in range(CONST_NUM_TIMESLOT):
        daytime = index_timeslot%48
        weekday = index_timeslot/48

        # const 0.5 propagate daily activity to other weekdays that does not have such event.
        # It is good for "잠", "식사" tokens because it is everyday event.
        score[index_timeslot] = math.log(max(num_tok_weekday[weekday], factor_daypropagation) * num_tok_daytime[daytime] + 1)


    if(scale):
        # Scaling
        smoothed_score = smoother(score, factor_smooth)
        max_val = max(smoothed_score)
        return [float(x)/max_val for x in smoothed_score]
    else:
        return smoother(score, factor_smooth)



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

    is_unknown = [0] * len(tokens)

    for index_token, token in enumerate(tokens):
        # For each token, calculate its term frequency over a day and over weekdays.
        score = presetScore.getPresetScore(token)
        if score == None:
            # No preset exists. Let's calculate token score.

            # num_tok_timeslot[i]: number of tokens appeared in timeslot i.
            num_tok_daytime = [0] * 48
            num_tok_weekday = [0] * 7

            # type:200, 9999 only retrive tokens for task-ongoing event or Google Calander event.

            for pred_token in token_collection.find({"userId": user_id, "text": token, "$or": [{"type": 200}, {"type": 9999}]}):
                if pred_token["weekday"] != -1:
                    num_tok_weekday[pred_token["weekday"]] += 1
                if pred_token["daytime"] != -1:
                    num_tok_daytime[pred_token["daytime"]] += 1

            # print token, num_tok_weekday, num_tok_daytime

            # If the token never occurs in PredictToken, we are going to ignore this token.
            occurence = sum(x>0 for x in num_tok_weekday)
            if occurence == 0:
                is_unknown[index_token] = 1;
                continue
            score = getTimeSlotScore(num_tok_weekday, num_tok_daytime)

        score_lookup_table[index_token] = score


    # Get tokens' total score from each token's score.
    # Below code get average of all tokens.
    total_score = [0] * CONST_NUM_TIMESLOT

    for index_timeslot in range(CONST_NUM_TIMESLOT):
        num_token = 0
        score = 0
        for index_token, token in enumerate(tokens):
            if is_unknown[index_token]:
                # tokens not in PredictToken DB don't contriubute to the score.
                continue
            else:
                num_token += 1
                score += score_lookup_table[index_token][index_timeslot]

        if num_token != 0:
            total_score[index_timeslot] = float(score) / num_token # This is average

    return total_score


def batchCalcTimePrefScore():
    """
    Batch work process.
    Access DB's predicttokens collection and task collection.
    Calculate score, and save it back to the DB.

    """
    from pymongo import MongoClient
    import tokenizer

    client = MongoClient(CONST_DB_ADDR, CONST_DB_PORT)
    # print client.database_names()
    db = client.test
    # print db.collection_names()

    task_collection = db.tasks;
    token_collection = db.predicttokens;
    for c in task_collection.find():
        # Run for all tasks.

        # We may want to run only for non-completed tasks because they are
        # the only tasks that time preference score matters.
        # However, for now we don't have enough data, so we need to use every
        # tasks even if it is already completed.

        # get score for all time slots.
        if c.has_key('description'):
            desc = c['description']
        else:
            desc = ''

        content = c['name'] + ' ' + desc
        # print 'Process: ', content
        tokens = tokenizer.get(content);
        score = getTimePrefScore(c['userId'], token_collection, tokens)
        # print score
        task_collection.update_one({'_id': c['_id']}, {'$set': {'timePreferenceScore': score}});


def main():
    import datetime
    print "START Batch JOB @ %s" % (datetime.datetime.now())

    batchCalcTimePrefScore();

    print "End Batch JOB @ %s" % (datetime.datetime.now())

if __name__=='__main__':
    main()
