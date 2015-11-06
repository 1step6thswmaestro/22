'use strict'

var mongoose = require('mongoose');
var Task = mongoose.model('Task');
var Q = require('q');

function init(app){
	function TaskHelper(){
	}

	TaskHelper.prototype.find = function(userId, query, proj, opt){
		opt = opt || {};
		opt.sort = opt.sort || {created: 1};
		return Q.nbind(Task.find, Task)(Object.assign({userId}, query), proj, opt);
	}

	TaskHelper.prototype.findByEstimation = function(userId, query, proj, opt){
		opt = opt || {};
		opt.sort = opt.sort || {estimation: 1};
		return Q.nbind(Task.find, Task)(Object.assign({userId}, query), proj, opt);
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

	TaskHelper.prototype.findOneAndUpdate = function(userId, query, doc){
		return Q.nbind(Task.findOneAndUpdate, Task)(Object.assign({userId}, query), {$set: doc});
	}

	app.helper.taskHelper = new TaskHelper();
}

module.exports = init;
