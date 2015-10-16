'use strict'

var mongoose = require('mongoose');
var Task = mongoose.model('Task');
var TaskLog = mongoose.model('TaskLog');
var Account = mongoose.model('Account');
var TaskActionType = require('../../../constants/TaskLogType');
var Q = require('q');

module.exports = function(router, app){
	let helper = app.helper;


	// I put this address resolver here, becuase locations.json is created from tasklogs.
	router.get('/locations.json', function(req, res){
		Account.findOne({'_id' :req.user._id}, function (err, account){
			if (err) return handleError(err);
			res.send(account.locations);
		});
	})

	router.get('/tasklog/:taskId', function(req, res){
		console.log('tasklog', req.params);

		const taskId = req.params.taskId;
		helper.tasklog.find(req.user._id, {taskId})
		.then(list=>res.send(list));
	})
}
