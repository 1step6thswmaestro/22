'use strict'

var mongoose = require('mongoose');
var Task = mongoose.model('Task');
var TaskLog = mongoose.model('TaskLog');
var TaskLogType = require('../../../constants/TaskLogType');
var TaskState = require('../../../constants/TaskState');
var Q = require('q');
var express = require('express');
var tokenizer = require('../../../taskprocess/tokenizer');

var TimeslotUpdater = require('../../../taskprocess/TimeslotUpdater');

module.exports = function(_router, app){
	let helper = app.helper;
	let router = express.Router();
	_router.use('/tasks', router);
	var taskTokenizer = new tokenizer(app);
	var timslotUpdater = new TimeslotUpdater(app);


	router.get('/testcommand_droptasks', function(req, res){
		// This request removes every tasks related to the current user.
		Task.remove({userId: req.user._id}, function(err){
			if (err) return res.send(err);
			res.send('remove done.');
		});
	})

	router.get('/', function(req, res){
		var time;
		if (typeof req.query.time == 'undefined')
		{
			time = new Date(Date.now());
		}
		else{
			time = new Date(Number(req.query.time));
		}
		var timeslotIdx = time.getHours()*2 + Math.floor(time.getMinutes()/30);

		// This request returns all tasks that are saved for the user.
		Q.all([helper.taskHelper.find(req.user._id, {state: {$ne: TaskState.named.started.id}})
			, helper.priTaskHelper.find(req.user._id, undefined, timeslotIdx)])
			//, helper.priTaskHelper.find(req.user._id, {state: {$ne: TaskState.named.started.id}}, timeslotIdx)])
		.then(results=>res.send({list: results[0], plist: results[1]}));
	})

	router.get('/ongoing', function(req, res){
		helper.taskHelper.find(req.user._id, {state: TaskState.named.started.id})
		.then(result=>res.send({list: result}));
	})

	router.get('/prioritized', function(req, res){
		var time;
		if (typeof req.query.time == 'undefined')
		{
			time = new Date(Date.now());
		}
		else{
			time = new Date(Number(req.query.time));
		}
		var timeslotIdx = time.getHours()*2 + Math.floor(time.getMinutes()/30);
		helper.priTaskHelper.find(req.user._id, undefined, timeslotIdx)
		.then(result=>res.send({plist: result}))
		.fail(err=>res.send(err));
	})
	router.get('/prioritized-timepref', function(req, res){
		var time;
		if (typeof req.query.time == 'undefined')
		{
			time = new Date(Date.now());
		}
		else{
			time = new Date(Number(req.query.time));
		}
		var timeslotIdx = time.getHours()*2 + Math.floor(time.getMinutes()/30);
		helper.priTaskHelper.findByTimePreference(req.user._id, undefined, timeslotIdx)
		.then(result=>res.send({plist: result}))
		.fail(err=>res.send(err));
	})


	router.post('/', function(req, res){
		// This request create new task for the current user.
		let userId = req.user._id;
		let task = _.pick(req.body, 'name', 'description', 'created', 'importance', 'duedate');
		task.lastProcessed = task.created;
		let created = req.body.created;
		let loc = req.body.loc;

		app.helper.taskHelper.create(userId, task)
		.then(function(obj){
			return app.helper.tasklog.create(obj.userId, obj._id, TaskLogType.named.create, {loc, time: created})
			.then(()=>obj);
		})
		.then((obj)=>res.send(obj))
		.fail(err=>logger.error(err))
	})

	router.post('/modify', function(req, res){
		// This request modifies given task's name and description field.
		let task = _.pick(req.body, '_id', 'name', 'description', 'created', 'duedate');

		// Overwrite only picked fields' value, whereas others maintain.
		var modifiedTask = Task(task).toObject();

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
		// Handle event related to task. Update task according to the event type.

		if(!TaskLogType.named[req.params.command]){
			// Undefined command recieved.
			next();
			return;
		}

		var commandType = TaskLogType.named[req.params.command];
		var nextState = TaskState.named[commandType.nextState];

		var p0 = helper.taskHelper.update(req.user._id, {_id: req.params._id}, {state: nextState.id});

		var p1 = helper.tasklog.create(req.user._id, req.params._id, commandType, {
			loc: req.body.loc
			, time: req.body.time
		});

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
		.then(function(result){
			timslotUpdater.updateTimeslot(result.log);
			taskTokenizer.processTask(req.user, result.task)

			res.send(result);
		})
		.fail(err=>logger.error(err))
	})
}
