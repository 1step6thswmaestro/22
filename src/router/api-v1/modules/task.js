'use strict'

var mongoose = require('mongoose');
var Task = mongoose.model('Task');
var TaskLog = mongoose.model('TaskLog');
var TaskStateType = require('../../../constants/TaskStateType');
var Q = require('q');
var express = require('express');
var TimeEstimator = require('../../../taskprocess/estimator');

var allowedTaskProperties = ['name', 'description', 'created', 'important', 'duedate', 'adjustable', 'estimation', 'marginBefore', 'marginAfter'];

module.exports = function(_router, app){
	let helper = app.helper;
	let router = express.Router();
	_router.use('/tasks', router);
	var timeEstimator = new TimeEstimator(app, {defaults: 1});

	function objectify(task){
		return task.toObject?task.toObject():task;
	}

	function omit(task){
		return _.omit(task, 'timePreferenceScore');
	}

	function addProcessedTime(query, task){
		return helper.taskHelper.getProcessedTime(task, query.time?parseInt(query.time):Date.now())
		.then(processedTime=>{
			task.processedTime = processedTime;
			return task;
		})
	}

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

	router.get('/:_id', function(req, res){
		app.helper.taskHelper.findOne(req.user._id, {_id: req.params._id})
		.then(objectify)
		.then(omit)
		.then(task=>addProcessedTime(req.query, task))
		.then(task=>res.send(task))
		.fail(err=>console.err(err, err.stack))
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
		let task = _.pick(req.body, allowedTaskProperties);
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
		let task = _.pick(req.body, '_id', allowedTaskProperties);

		app.helper.taskHelper.update(req.user._id, {_id: task._id}, task)
		.then(()=>app.helper.taskHelper.findOne(req.user._id, {_id: task._id}))
		.then(task=>res.send(task))
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
		body = _.pick(body, 'important', 'adjustable');

		helper.taskHelper.findByIdAndUpdate(req.user._id, req.params.id, body)
		.then(function(){
			return helper.taskHelper.findOne(req.user._id, {_id: req.params.id});
		})
		.then(result=>res.send({task: result}))
		.fail(err=>logger.error(err))
	})

	router.put('/:_id/increment/:propertyName', function(req, res){
		let body = req.body || {};
		let value = parseFloat(body.value || 0);
		let _id = req.params._id;
		let userId = req.user._id;
		let propertyName = req.params.propertyName;
		let query = {_id};

		if(value < 0){
			query[propertyName] = {$gte: -value};
		}

		console.log({_id, propertyName, value})

		return helper.taskHelper.__findOneAndUpdate(userId, query, {$inc: {[propertyName]: value}})
		.then(()=>helper.taskHelper.findOne(userId, {_id}))
		.then(objectify)
		.then(omit)
		.then(task=>addProcessedTime(req.query, task))
		.then(task=>res.send({task}))
		.fail(err=>logger.error(err, err.stack))
		;
	})
}
