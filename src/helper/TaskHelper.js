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

	TaskHelper.prototype.setState = function(userId, taskId, state, opt){
		opt = opt || {}
		var type = TaskStateType.named[state];
		var taskType = type;
		if(type.state){
			taskType = TaskStateType.named[type.state];
		}
		let self = this;

		var p0 = this.update(userId, {_id: taskId}, {state: taskType.id});
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
		.then(function(result){
			taskTokenizer.processTask(userId, result.task, opt.time)
			return result;
		})
	}

	app.helper.taskHelper = new TaskHelper();
}

module.exports = init;
