'use strict'

var mongoose = require('mongoose');
var Task = mongoose.model('Task');
var Q = require('q');

var RandomPriorityStrategy = require('../task_strategy/RandomPriorityStrategy')
var TokenBasedPriorityStrategy = require('../task_strategy/TokenBasedPriorityStrategy')

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

		// let scoringStrategy = new RandomPriorityStrategy(app);
		let scoringStrategy = new TokenBasedPriorityStrategy(app);

		return Q(scoringStrategy.ready(userId, time))
		.then(function(){
			return helper.taskHelper.find(userId)
		})
		.then(function(tasks){
			return Q.all(_.map(tasks, task=>{
				return Q.nbind(Task.findByIdAndUpdate, Task)(task.id, {priorityScore: scoringStrategy.calculate(task)});
			}));
		})
		.fail(err=>logger.error(err));
	}

	PrioritizedTaskHelper.prototype.find = function(userId, query, time){
		return this.update(userId, time)
		.then(function(results){
			var scoreLabel = 'timePreferenceScore.'.concat(time);
			var opt = {sort: {}};
			opt.sort[scoreLabel]=-1;
			return helper.taskHelper.find(userId, query, null, opt)
		});
	}

	app.helper.priTaskHelper = new PrioritizedTaskHelper();
}

module.exports = init;
