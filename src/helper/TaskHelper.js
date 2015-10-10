'use strict'

var mongoose = require('mongoose');
var Task = mongoose.model('Task');
var TaskAction = mongoose.model('TaskAction');
var Q = require('q');

function init(app){
	function TaskHelper(){
	}

	TaskHelper.prototype.find = function(userId, query, proj, opt){
		opt = opt || {};
		opt.sort = opt.sort || {created: 1};
		return Q.nbind(Task.find, Task)(Object.assign({userId}, query), proj, opt);
	}

	TaskHelper.prototype.create = function(userId, body){
		let task = new Task(_.extend({userId}, body));
		return Q.nbind(task.save, task)()
		.then(function(obj){
			return obj[0];
		})
	}

	TaskHelper.prototype.createAction = function(taskId, type, _loc){
		console.log('loc : ', _loc);

		let action = {
			taskId
			, type: type.id
		}

		if(_loc){
			action.loc = {
		      type: 'Point',
		      coordinates: [parseFloat(_loc[0]||_loc.lon), parseFloat(_loc[1]||_loc.lat)]
		    }
		}

		console.log(action);
		action = new TaskAction(action);

		return Q.nbind(action.save, action)();
	}

	app.helper.taskHelper = new TaskHelper();
}

module.exports = init;
