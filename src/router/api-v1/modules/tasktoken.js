'use strict'

var tokenizer = require('../../../taskprocess/tokenizer');
var py_interpreter = require('../../../app/python_interpreter');
var Q = require('q');
var _ = require('underscore');

module.exports = function(router, app){
	let helper = app.helper;

	var taskTokenizer = new tokenizer(app);

	router.get('/tasktoken/timeprefscore/:taskId/', function(req, res){
		helper.taskHelper.find(req.user._id, {_id: req.params.taskId})
		.then((results)=>{
			var task = results[0];
			var content = task.name + '' + task.description;


			taskTokenizer.tokenizeText(content)
			.then(tokens=>{
				Q.all(_.map(tokens, token => {
					// console.log('calc timeprefscore on the fly:', token);
					return py_interpreter.getTimePrefScore(req.user._id.valueOf(), token);
				}))
				.then(results=>{
					py_interpreter.getTimePrefScore(req.user._id.valueOf(), tokens)
					.then((taskscore)=>{
						var finalResult = [taskscore, results];
						res.send(finalResult);
					});
				})
				.fail(err=>logger.error(err))
			});
		})
		.fail((err)=>{
			res.send(err);
		})
	})

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
		taskTokenizer.tokenizeText(req.params.str)
		.then(tokens=>res.send(tokens));
	})
}
