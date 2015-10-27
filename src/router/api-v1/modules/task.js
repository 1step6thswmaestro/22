'use strict'

var mongoose = require('mongoose');
var Task = mongoose.model('Task');
var TaskLog = mongoose.model('TaskLog');
var TaskLogType = require('../../../constants/TaskLogType');
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
		let time = req.query.time?parseInt(req.query.time):Date.now();


		Q.all([helper.taskHelper.find(req.user._id)
			, helper.priTaskHelper.find(req.user._id, undefined, parseInt(time))])
		.then(results=>res.send({list: results[0], plist: results[1]}));
	})

	router.get('/prioritized', function(req, res){
		helper.priTaskHelper.find(req.user._id, undefined, parseInt(req.query.time))
		.then(result=>res.send({plist: result}));

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
		if(!TaskLogType.named[req.params.command]){
			// Undefined command recieved.
			next();
			return;
		}

		var type = TaskLogType.named[req.params.command];
		var taskType = type;
		if(type.state){
			taskType = TaskLogType.named[type.state];
		}

		var p0 = helper.taskHelper.update(req.user._id, {_id: req.params._id}, {state: taskType.id});
		var p1 = helper.tasklog.create(req.user._id, req.params._id, TaskLogType.named[req.params.command], {
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
