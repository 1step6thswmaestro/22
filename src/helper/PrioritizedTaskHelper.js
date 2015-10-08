'use strict'

var mongoose = require('mongoose');
var Task = mongoose.model('Task');
var Q = require('q');

var RandomPriorityStrategy = require('../task_strategy/RandomPriorityStrategy')

function init(app){
	var helper = app.helper;
	var lastUpdateTime = {}
	
	function PrioritizedTaskHelper(){
	}

	PrioritizedTaskHelper.prototype.update = function(userId){
		let time = Date.now();
		if(lastUpdateTime[userId] && (time-lastUpdateTime[userId])<=3000){
			return Q()
		}

		lastUpdateTime[userId] = time;

		let scoringStrategy = new RandomPriorityStrategy();

		return helper.taskHelper.find(userId)
		.then(function(tasks){
			return Q.all(_.map(tasks, task=>{
				return Q.nbind(Task.findByIdAndUpdate, Task)(task.id, {priorityScore: scoringStrategy.calculate(task)});
			}));
		})
		.fail(err=>logger.error(err));
	}	

	PrioritizedTaskHelper.prototype.find = function(userId, query){
		return this.update(userId)
		.then(function(results){
			return helper.taskHelper.find(userId, query, null, {sort: {priorityScore: -1}})
		});
	}

	app.helper.priTaskHelper = new PrioritizedTaskHelper();
}

module.exports = init;
