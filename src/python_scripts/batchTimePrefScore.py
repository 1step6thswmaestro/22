#!usr/bin/python

def tokenize(content):
	# Simple tokenizer. Split with white space.
	# NOTE: Match this tokenizer with the tokenizer used to put tokens into timeslot.
	return content.strip().split();


def get_tf(collection, user_id, timeslot_index, token):
	# Get term frequency of given token from specified timeslot.

	# For now, we calculate it on the fly. O(numTokens)
	# We can save time with pre calculation.

	timeslot = collection.find_one({'userId': user_id, 'slotIndex': timeslot_index});

	count = 0
	if timeslot != None:
		for tok in timeslot['tokens']:
			if tok == token:
				count = count + 1

	return count

def get_idf(collection, user_id, token):
	# Get inverse document frequency of given token from all timeslot.

	# For now, we calculate it on the fly. O(numTimeSlot * O(get_tf()))
	# We can save time with pre calculation.
	import math
	num_total_timeslot = 48
	total_count = 0
	for i in range(num_total_timeslot):
		total_count = total_count + get_tf(collection, user_id, i, token)

	if total_count == 0:
		return  0;
	else:
		return math.log(num_total_timeslot / total_count)

def eval_task_score(timeslot_collection, user_id, timeslot_index, task):
	# Evaluate score of task for a given time slot.

	# Assume that tasks's score is sum of each token's score.
	score = 0;

	tokens = tokenize(task['name'] + task['description'])
	for token in tokens:
		score = get_tf(timeslot_collection, user_id, timeslot_index, token) * get_idf(timeslot_collection, user_id, token)

	return score;


def eval_task_allday_score(timeslot_collection, user_id, task):
	"""
	Evaulate allday score.
	return value is a array containing 48 scores.
	"""

	scores = [];
	for timeslot_index in range(48):
		# Suppose we have a task, and given time.
		# Now we get score.
		score = eval_task_score(timeslot_collection, user_id, timeslot_index, task);
		scores.append(score);

	return scores;

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

def batch_eval_score():
	# Batch Process for tasks.
	# If you don't want to run batch. You can call eval_task_allday_score()
	# whenever user created/updated new task.
	from pymongo import MongoClient

	# db_addr='128.199.166.149'
	db_addr='localhost'
	db_port=27340

	client = MongoClient(db_addr, db_port)
	# print client.database_names()
	db = client.test
	# print db.collection_names()
	task_collection = db.tasks;
	timeslot_collection = db.timeslots;
	from random import randint

	for c in task_collection.find():
		# Run for all tasks.
		# We may want to run only for non-completed tasks.
		# However, for now we don't have enough data, so we need to use every
		# tasks even if it is already completed.

		# get score for all time slots.

		tmp = eval_task_allday_score(timeslot_collection, c['userId'], c)
		timePreferenceScore = smoother(tmp)
		task_collection.update_one({'_id': c['_id']}, {'$set': {'timePreferenceScore': timePreferenceScore}});

def main():
	import datetime
	print "START Batch JOB @ %s" % (datetime.datetime.now())

	batch_eval_score();

	print "End Batch JOB @ %s" % (datetime.datetime.now())

if __name__=='__main__':
	main()
