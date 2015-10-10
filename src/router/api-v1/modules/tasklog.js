'use strict'

var mongoose = require('mongoose');
var Task = mongoose.model('Task');
var TaskLog = mongoose.model('TaskLog');
var TaskActionType = require('../../../constants/TaskLogType');
var Q = require('q');

module.exports = function(router, app){
	let helper = app.helper;

	router.get('/tasklog/:taskId', function(req, res){
		console.log('tasklog', req.params);

		const taskId = req.params.taskId;
		helper.tasklog.find(req.user._id, {taskId})
		.then(list=>res.send(list));
	})
}