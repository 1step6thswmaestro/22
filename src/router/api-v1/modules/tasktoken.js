'use strict'

var tokenizer = require('../../../taskprocess/tokenizer');
var _ = require('underscore');

module.exports = function(router, app){
	let helper = app.helper;

	var taskTokenizer = new tokenizer(app);

	router.get('/tasktoken/task/:_id/reset', function(req, res){
		taskTokenizer.resetTaskById(req.user, req.params._id);

		res.send();
	})

	router.get('/tasktoken/task/:taskId/', function(req, res){
		app.helper.predictToken.find(req.user._id, {
			taskId: req.params.taskId
		}, undefined, {sort: {time: 1}})
		.then(function(tokens){
			res.send(tokens);
		})

	})

	router.get('/tasktoken/time/:time?/group', function(req, res){
		let time = parseInt(req.params.time) || Date.now();
		let timeDivision = taskTokenizer.getTimeDivision(time);
		let daytime = timeDivision%48;

		app.helper.predictToken.find(req.user._id, {
			daytime: {$gte: daytime-2, $lte: daytime+2}
		}, undefined, {sort: {time: 1}})
		.then(function(tokens){
			//res.send(_.mapObject(_.groupBy(tokens, 'text'), arr=>_.countBy(arr, 'status')));
			res.send(_.mapObject(_.groupBy(tokens, 'status'), arr=>_.countBy(arr, 'text')));
		})
	})

	router.get('/tasktoken/time/:time?', function(req, res){
		let time = parseInt(req.params.time) || Date.now();
		let timeDivision = taskTokenizer.getTimeDivision(time);
		let daytime = timeDivision%48;

		app.helper.predictToken.find(req.user._id, {
			daytime: {$gte: daytime-2, $lte: daytime+2}
		}, undefined, {sort: {time: 1}})
		.then(function(tokens){
			res.send(tokens);
		})
	})

	
	router.get('/tasktoken/test/:str', function(req, res){
		res.send(taskTokenizer.tokenizeText(req.params.str));
	})
}