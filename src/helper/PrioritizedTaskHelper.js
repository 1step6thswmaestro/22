'use strict'

var mongoose = require('mongoose');
var Task = mongoose.model('Task');
var Q = require('q');

var ComprehensivePriorityStrategy = require('../task_strategy/ComprehensivePriorityStrategy')

function init(app){
	var helper = app.helper;
	var lastUpdateTime = {}

	function PrioritizedTaskHelper(){
	}

	PrioritizedTaskHelper.prototype.update = function(userId, time){
		let currentTime = Date.now();
		// if(lastUpdateTime[userId] && (currentTime-lastUpdateTime[userId])<=3000){
		// 	return Q()
		// }

		lastUpdateTime[userId] = currentTime;

		let scoringStrategy = new ComprehensivePriorityStrategy(app);

		return Q(scoringStrategy.ready(userId, time))
		.then(function(){
			return helper.taskHelper.find(userId);
		})
		.then(function(tasks){
			return Q.all(_.map(tasks, task=>{
				// Get logs and calculate priority of each task.
				Q(helper.tasklog.find(userId, {taskId: task._id}))
				.then(function(logs){
					return Q.nbind(Task.findByIdAndUpdate, Task)(task.id, {priorityScore: scoringStrategy.calculate(task, logs)});
				})
			}));
		})
		.fail(err=>logger.error(err));
	}

	PrioritizedTaskHelper.prototype.findByTimePreference = function(userId, query, time){
		return this.update(userId, time)
		.then(function(results){
			var _time = new Date(time);
			var timeslotIdx = _time.getHours()*2 + Math.floor(_time.getMinutes()/30);
			var scoreLabel = 'timePreferenceScore.'.concat(timeslotIdx);
			var opt = {sort: {}};
			opt.sort[scoreLabel]=-1;
			return helper.taskHelper.find(userId, query, null, opt)
		});
	}

	PrioritizedTaskHelper.prototype.find = function(userId, query, time){
		return this.update(userId, time)
		.then(function(results){
			return helper.taskHelper.find(userId, query, null, {sort: {priorityScore: 1}})
		});
	}

	app.helper.priTaskHelper = new PrioritizedTaskHelper();
}

module.exports = init;
