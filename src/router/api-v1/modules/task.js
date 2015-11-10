'use strict'

var mongoose = require('mongoose');
var Task = mongoose.model('Task');
var TaskLog = mongoose.model('TaskLog');
var TaskStateType = require('../../../constants/TaskStateType');
var Q = require('q');
var express = require('express');
var TimeEstimator = require('../../../taskprocess/estimator');

module.exports = function(_router, app){
	let helper = app.helper;
	let router = express.Router();
	_router.use('/tasks', router);
	var timeEstimator = new TimeEstimator(app, {defaults: 1});

	router.get('/testcommand_droptasks', function(req, res){
		// This request removes every tasks related to the current user.
		Task.remove({userId: req.user._id}, function(err){
			if (err) return res.send(err);
			res.send('remove done.');
		});
	})

	router.get('/', function(req, res){
		let time = req.query.time?parseInt(req.query.time):Date.now();

		helper.taskHelper.find(req.user._id)
		.then(results=>res.send({list: results}))
	})

	router.get('/prioritized/:method?', function(req, res){
		console.log('recieved_str: ', req.query.time);
		let time = req.query.time?parseInt(req.query.time):Date.now();

		let promise;
		switch(req.params.method){
			case 'time':
				console.log(time)
				promise = helper.priTaskHelper.findByTimePreference(req.user._id, undefined, time);
				break;
			default:
				promise = helper.priTaskHelper.find(req.user._id, undefined, time);
				break;

		}

		promise
		.then(result=>res.send({plist: result}))
		.fail(err=>res.status(400).send(err));
	})

	router.post('/', function(req, res){
		// This request create new task for the current user.
		let userId = req.user._id;
		let task = _.pick(req.body, 'name', 'description', 'created', 'important', 'duedate', 'adjustable', 'estimation', 'marginBefore', 'marginAfter');
		task.lastProcessed = task.created;
		let created = req.body.created;
		let loc = req.body.loc;

		console.log(task);

		console.log(task.estimation || 'estimation');

		Q(task.estimation || timeEstimator.estimate(userId, task.name))
		.then(result=>{
			task.estimation = result;
			console.log(task);
			app.helper.taskHelper.create(userId, task)
			.then(function(obj){
				return app.helper.tasklog.create(obj.userId, obj._id, TaskStateType.named.create, {loc, time: created})
				.then(()=>obj);
			})
			.then((obj)=>res.send(obj))
			.fail(err=>logger.error(err));
		});
	})

	router.post('/modify', function(req, res){
		// This request modifies given task's name and description field.
		let task = _.pick(req.body, '_id', 'name', 'description', 'created', 'duedate');
		let modifiedTask = Task(task).toObject();

		app.helper.taskHelper.update(req.user._id, {_id: task._id}, modifiedTask)
		.then(function(){
			res.send(modifiedTask);
		})
		.fail(err=>{
			if(err) throw err;
		})
	})

	router.delete('/:id', function(req, res){
		// This request delete specific task.
		//TODO
		//remove related datas
		Task.remove({userId: req.user._id, _id: req.params.id}, function(err){
			if (err) return res.status(400).send(err);
			res.send({});
		});
	})

	router.put('/:_id/:command', function(req, res, next){
		if(!TaskStateType.named[req.params.command]){
			// Undefined command recieved.
			next();
			return;
		}

		app.helper.taskHelper.setState(req.user._id, req.params._id, req.params.command, req.body)
		.then(results=>res.send(results))
		.fail(err=>logger.error(err))
	})

	router.put('/:id/set', function(req, res){
		let body = req.body;
		body = _.pick(body, 'important');

		helper.taskHelper.findByIdAndUpdate(req.user._id, req.params.id, body)
		.then(function(){
			return helper.taskHelper.findOne(req.user._id, {_id: req.params.id});
		})
		.then(result=>res.send({task: result}))
		.fail(err=>logger.error(err))

	})
}
