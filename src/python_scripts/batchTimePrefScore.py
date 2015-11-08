#!usr/bin/python
# -*- coding: utf-8 -*-


# Please change below DB Address only when you schedule regular job with cron.
CONST_DB_ADDR='128.199.166.149'
# CONST_DB_ADDR='localhost'
CONST_DB_PORT=27340

CONST_NUM_TIMESLOT = 48*7
DEBUG = False

import math

def log(var, indent = 0):
    if DEBUG == False:
        return
    import json
    space = ' ' * indent;
    print space, json.dumps(var, ensure_ascii=False)


def smoother(numtype_arr):
    """
    reflect neighboring timeslot's score.
    """

    result_arr = [0] * len(numtype_arr)
    window = [0.1, 0.5, 1, 0.5, 0.1]; # weight for neighbor.
    for idx in range(len(numtype_arr)):
        weighted_sum = 0;

        window_one_side_len = len(window)/2;

        for offset in range( - window_one_side_len, window_one_side_len + 1):
            weighted_sum = weighted_sum + window[offset + window_one_side_len] * numtype_arr[(idx + offset) % len(numtype_arr)]

        result_arr[idx] = weighted_sum;
    return result_arr

def getTimePrefScore(user_id, token_collection, tokens):
    """
    return total tf-idf score from given tokens.
	During calculation, it use only tokens belong to given user_id.
    """

    # Init tf-idf score for every timeslot per each token.
    # score_matrix[i][j] : tf-idf score for tokens[i] at timeslot[j]
    score_matrix = []
    for token in tokens:
        score_matrix.append([0] * CONST_NUM_TIMESLOT)

    for index_token, token in enumerate(tokens):
        # For each token, calculate its tf-idf score for every timeslot.

        # num_tok_timeslot[i]: number of tokens appeared in timeslot i.
        num_tok_timeslot = [0] * CONST_NUM_TIMESLOT

        # type:200, 9999 only retrive tokens for task-ongoing event or Google Calander event.
        for pred_token in token_collection.find({"userId": user_id, "text": token, "$or": [{"type": 200}, {"type": 9999}]}):
            index_timeslot = pred_token["timeslotIndex"]
            num_tok_timeslot[index_timeslot] = num_tok_timeslot[index_timeslot] + 1

        # Get IDF. Here the Document is timeslot.
        num_used_timeslot = sum(x>0 for x in num_tok_timeslot)

        score_idf = 0
        if num_used_timeslot != 0:
            score_idf = math.log(float(CONST_NUM_TIMESLOT) / num_used_timeslot)


        for index_timeslot in range(CONST_NUM_TIMESLOT):
            # add tf-idf score for every timeslot.
            score_tf = num_tok_timeslot[index_timeslot]
            score_tf_idf = score_tf * score_idf
            score_matrix[index_token][index_timeslot] = score_tf_idf


    # Get tokens' total score from each token's score.

    # Below code get average of all tokens.
    total_score = [0] * CONST_NUM_TIMESLOT
    for index_timeslot in range(CONST_NUM_TIMESLOT):
        score_positive = []
        for index_token, token in enumerate(tokens):
            if score_matrix[index_token][index_timeslot] != 0:
                score_positive.append((token, score_matrix[index_token][index_timeslot]))


        # Yeah. This is average of 3 most maximum keyword.
        # If there are less than 3 scores, just average them.

        if len(score_positive) == 0:
            total_score[index_timeslot] = 0
        else:
            score_positive.sort(key=lambda x: x[1], reverse=True)
            log('score')
            log(score_positive)

            num_atmost3 = min(len(score_positive), 3)
            for i in range(num_atmost3):
                total_score[index_timeslot] += score_positive[i][1]
            total_score[index_timeslot] /= float(num_atmost3)

            log('avg:')
            log(total_score[index_timeslot])

    # Post Processing for smoothing

    return smoother(total_score)

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
        content = c['name'] + ' ' + c['description']
        tokens = tokenizer.extractor(content);
        score = getTimePrefScore(c['userId'], token_collection, tokens)
        task_collection.update_one({'_id': c['_id']}, {'$set': {'timePreferenceScore': score}});


def main():
	import datetime
	print "START Batch JOB @ %s" % (datetime.datetime.now())

	batchCalcTimePrefScore();

	print "End Batch JOB @ %s" % (datetime.datetime.now())

if __name__=='__main__':
	main()
