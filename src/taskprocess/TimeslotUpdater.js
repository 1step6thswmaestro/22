'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TaskStateType = require('../constants/TaskStateType');
var Q = require('q');

var TimeSlot = mongoose.model('TimeSlot');
var py_interpreter = require('../app/python_interpreter');


class TimeslotUpdater{
	constructor(app){
		this.app = app;
	}

	updateTimeslot(taskLog){
		// Update Time Preference Engine.
		if (taskLog.type != TaskStateType.named.pause.id && taskLog.type != TaskStateType.named.complete.id){
			return;
		}

		// DB Access. Get related task, and previous taskLog for start event.
		var p0 = this.app.helper.taskHelper.find(taskLog.userId, {_id: taskLog.taskId});
		var p1 = this.app.helper.tasklog.findOne(taskLog.userId,
			{taskId: taskLog.taskId, type: TaskStateType.named.start.id},
			undefined, {sort: {time: -1}}); // Find most recent start event log.


		Q.all([p0, p1])
		.then(function(results){
			// console.log('Found task and startLog');

			var task = results[0][0];
			var startLog = results[1];

			// Get tokens of related task.
			// For PoC, tokenize on the fly.
			var tokens = this.tokenizeTask(task);
			console.log(tokens);

			// Get duration of current task. It means the time difference
			// from the last time the task started to the current time.
			var startIdx, endIdx;

			startIdx = startLog.time.getHours()*2 + Math.floor(startLog.time.getMinutes()/30);
			endIdx = taskLog.time.getHours()*2 + Math.floor(taskLog.time.getMinutes()/30);
			// console.log(startLog);
			// console.log(taskLog);
			// console.log(startIdx, endIdx);

			// Term frequency update for each time slot.
			for(let i = startIdx; i<= endIdx; i++){

				// If token is not in dictionary, update the dictionary.
				TimeSlot.findOne({'slotIndex' : i}, function (err, timeslot){
					if (err) return handleError(err);
					// console.log('Prev Timeslot:')
					// console.log(timeslot)
					if (timeslot == null){
						var hourStr = ("00" + Math.floor(i/2)).slice (-2);
						let name = hourStr + (i%2==0 ? ':00' : ':30') ;
						timeslot = new TimeSlot();
						timeslot.slotIndex = i;
						timeslot.name = name;
						timeslot.userId = taskLog.userId;
						timeslot.tokens = [];
					}
					// console.log(timeslot)
					// console.log(tokens)
					// Update TimeSlot's wordcount
					for(let idx in tokens){
						// How can we avoid race condition on count increment?
						// console.log(tokens[idx]);
						timeslot.tokens.push(tokens[idx]);
					}
					// console.log('Updated Timeslot:')
					// console.log(timeslot)
					timeslot.save();
				});
			}
		}.bind(this))
		.fail(err=>logger.error(err))
	}

	tokenizeTask(task){
		var content = task.name + ' ' + task.description;

		// Simple tokenizer. With regex, match every non-whitespace strings.
		// var tokens = content.match(/\S+/g);

		var tokens = py_interpreter.getToken(content);
		return tokens;
	}
};
module.exports = TimeslotUpdater;
