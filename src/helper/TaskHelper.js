'use strict'

var mongoose = require('mongoose');
var Task = mongoose.model('Task');
var Q = require('q');
var tokenizer = require('../taskprocess/tokenizer');
var TaskStateType = require('../constants/TaskStateType');

function init(app){
	function TaskHelper(){
	}

	var taskTokenizer = new tokenizer(app);

	TaskHelper.prototype.find = function(userId, query, proj, opt){
		opt = opt || {};
		opt.sort = opt.sort || {created: 1};
		return Q.nbind(Task.find, Task)(Object.assign({userId}, query), proj, opt);
	}

	TaskHelper.prototype.findAll = function(query, proj, opt){
		opt = opt || {};
		opt.sort = opt.sort || {created: 1};
		return Q.nbind(Task.find, Task)(query, proj, opt);
	}

	TaskHelper.prototype.findOne = function(userId, query, proj, opt){
		opt = opt || {};
		opt.sort = opt.sort || {created: 1};
		return Q.nbind(Task.findOne, Task)(Object.assign({userId}, query), proj, opt);
	}

	TaskHelper.prototype.create = function(userId, body){
		let task = new Task(_.extend({userId}, body));
		return Q.nbind(task.save, task)()
		.then(function(obj){
			return obj[0];
		})
	}

	TaskHelper.prototype.update = function(userId, query, doc){
		return Q.nbind(Task.update, Task)(Object.assign({userId}, query), {$set: doc});
	}

	TaskHelper.prototype.findByIdAndUpdate = function(userId, _id, doc){
		return this.findOneAndUpdate(userId, {_id}, doc);
	}

	TaskHelper.prototype.findOneAndUpdate = function(userId, query, doc){
		return Q.nbind(Task.findOneAndUpdate, Task)(Object.assign({userId}, query), {$set: doc});
	}

	//TODO $set을 지우고 findOneAndUpdate와 합쳐져야 함.
	TaskHelper.prototype.__findOneAndUpdate = function(userId, query, doc){
		return Q.nbind(Task.findOneAndUpdate, Task)(Object.assign({userId}, query), doc);
	}

	TaskHelper.prototype.setState = function(userId, taskId, state, opt){
		opt = opt || {}
		var type = TaskStateType.named[state];
		var stateType = type;
		if(type.state){
			stateType = TaskStateType.named[type.state];
		}
		let self = this;

		var pSchedule;
		var doc = {state: stateType.id};

		if(opt.scheduleId){
			pSchedule = app.helper.timetable.findOne(userId, {_id: opt.scheduleId});
		}

		console.log({type});
		return Q.spread([pSchedule], function(schedule){
			switch(type.command){
				case 'postpone':
					if(schedule){
						doc.beginAfter = new Date((schedule.tableslotStart + opt.hours*2)*(30*60*1000));
					}
					else if(doc.beginAfter){
						doc.beginAfter = new Date((doc.beginAfter + opt.hours*2)*(30*60*1000));
					}
					break;
			}

			console.log({state, schedule, doc});

			var p0 = app.helper.taskHelper.update(userId, {_id: taskId}, doc);
			var p1 = app.helper.tasklog.create(userId, taskId, TaskStateType.named[state], {
				loc: opt.loc
				, time: opt.time
			});

			return Q.all([p0, p1])
			.then(function(results){
				return self.find(userId, {_id: taskId})
				.then(function(tasks){
					return {
						task: tasks[0]
						, log: results[1][0]
					}
				})
			})
		})
		.then(function(result){
			taskTokenizer.processTask(userId, result.task, opt.time)
			return result;
		})
	}

	TaskHelper.prototype.getProcessedTime = function(task, currentTime){
		currentTime = currentTime || Date.now();
		function _getProcessedTime(logs) {
			let takenTime = 0;

			let lognum;
			if(!logs) {
				lognum = -1;
			}
			else {
				lognum = logs.length;
			}

			let to = -1;
			let processed = false;
			while (--lognum > 0) {
				let logType = logs[lognum].type;
				if(logType == 300 || logType == 400) {
					to = lognum;
					processed = true;
				}
				else if ((logType == 200 || logType == 350) && processed) {
					let timeTo = new Date(logs[to].time);
					let timeFrom = new Date(logs[lognum].time);
					// console.log({timeTo, timeFrom});
					takenTime += timeTo - timeFrom;
					processed = false;
				}
			}

			return takenTime;
		}

		return app.helper.tasklog.find(task.userId, {taskId: task._id, time: {$lte: currentTime}})
		.then(logs=>{
			return _getProcessedTime(logs) || 0;
		})
	}

	app.helper.taskHelper = new TaskHelper();
}

module.exports = init;
