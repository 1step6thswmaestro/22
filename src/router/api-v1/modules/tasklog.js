'use strict'

var mongoose = require('mongoose');
var Task = mongoose.model('Task');
var TaskLog = mongoose.model('TaskLog');
var Account = mongoose.model('Account');
var Q = require('q');

module.exports = function(router, app){
	let helper = app.helper;


	// I put this address resolver here, becuase allLocations.json is created from tasklogs.
	router.get('/alllocations.json', function(req, res){
		Account.findOne({'_id' :req.user._id}, function (err, account){
			if (err) return handleError(err);
			// console.log(req.user._id);
			// console.log(account.locAllInfo);
			res.send(account.locAllInfo);
		});
	})

	// I put this address resolver here, becuase keyLocations.json is created from tasklogs.
	router.get('/keylocations.json', function(req, res){
		Account.findOne({'_id' :req.user._id}, function (err, account){
			if (err) return handleError(err);
			res.send(account.locClusterKey);
		});
	})

	router.get('/tasklog/:taskId', function(req, res){
		const taskId = req.params.taskId;
		helper.tasklog.find(req.user._id, {taskId})
		.then(list=>res.send(list));
	})

	router.get('/tasklog/task/:taskId', function(req, res){
		const taskId = req.params.taskId;
		helper.tasklog.find(req.user._id, {taskId})
		.then(list=>res.send(list));
	})
}
