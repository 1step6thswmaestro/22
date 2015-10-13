'use strict'

var mongoose = require('mongoose');
var Task = mongoose.model('Task');
var TaskLog = mongoose.model('TaskLog');
var TaskLogType = require('../../../constants/TaskLogType');
var Q = require('q');
var express = require('express');
var tokenizer = require('../../../taskprocess/tokenizer');

module.exports = function(_router, app){
	let helper = app.helper;
	let router = express.Router();
	_router.use('/tasks', router);
	var taskTokenizer = new tokenizer(app);


	router.get('/testcommand_droptasks', function(req, res){
		// This request removes every tasks related to the current user.
		Task.remove({userId: req.user._id}, function(err){
			if (err) return res.send(err);
			res.send('remove done.');
		});
	})

	router.get('/', function(req, res){
		// This request returns all tasks that are saved for the user.

		Q.all([helper.taskHelper.find(req.user._id)
			, helper.priTaskHelper.find(req.user._id)])
		.then(results=>res.send({list: results[0], plist: results[1]}));
	})

	router.get('/prioritized', function(req, res){
		helper.priTaskHelper.find(req.user._id)
		.then(result=>res.send({plist: result}));

	})

	router.post('/', function(req, res){
		// This request create new task for the current user.
		let userId = req.user._id;
		let task = _.pick(req.body, 'name', 'description', 'created', 'importance', 'duedate');
		task.lastProcessed = task.created;
		let created = req.body.created;
		let loc = req.body.loc;

		console.log('task', task);
		
		app.helper.taskHelper.create(userId, task)
		.then(function(obj){
			return app.helper.tasklog.create(obj.userId, obj._id, TaskLogType.named.create, {loc, time: created})
			.then(()=>obj);
		})
		.then((obj)=>res.send(obj))
		.fail(err=>logger.error(err))
	})

	router.get('/:id', function(req, res){
		// This request returns error. At this moment, we don't support for this kind of operation.
		res.send('SORRY! You cannot access taskid: ' + req.params.id + '<br/>This not a valid access method.');
	})

	router.delete('/:id', function(req, res){
		// This request delete specific task.
		Task.remove({userId: req.user._id, _id: req.params.id}, function(err){
			if (err) return res.status(400).send(err);
			res.send({});
		});
	})

	router.put('/:_id/:command', function(req, res, next){
		console.log('command', req.params);
		console.log(req.body);

		if(!TaskLogType.named[req.params.command]){
			next();
			return;
		}

		var type = TaskLogType.named[req.params.command];
		var taskType = type;
		if(type.state){
			taskType = TaskLogType.named[type.state];
		}

		var p0 = helper.taskHelper.update(req.user._id, {_id: req.params._id}, {state: taskType.id});
		var p1 = helper.tasklog.create(req.user._id, req.params._id, TaskLogType.named[req.params.command], req.body.loc);

		Q.all([p0, p1])
		.then(function(results){
			return helper.taskHelper.find(req.user._id, {_id: req.params._id})
			.then(function(tasks){
				return {
					task: tasks[0]
					, log: results[1][0]
				}
			})
		})
		.then(function(results){
			console.log(results);
			res.send(results);
		})
		.fail(err=>logger.error(err))
	})

	router.get('/:_id/update', function(req, res){
		app.helper.taskHelper.find(req.user._id, {_id: req.params._id})
		.then(function(tasks){
			var task = tasks[0];
			console.log('update : ', task);
			if(task){
				taskTokenizer.processTask(req.user, task);
			}
		})
		.fail(err=>logger.error(err, err.stack));

		res.send();
	})
}
