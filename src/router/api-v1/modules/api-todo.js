'use strict'

var mongoose = require('mongoose');
var Task = mongoose.model('Task');

module.exports = function(router, app){
	router.get('/testcommand_droptasks', function(req, res){
		// This request removes every tasks related to the current user.
		Task.remove({user_id: req.user._id}, function(err){
			if (err) return res.send(err);
			res.send('remove done.');
		});
	})

	router.get('/tasks', function(req, res){
		// This request returns all tasks that are saved for the user.
		Task.find({user_id: req.user._id}, function(err, tasks) {
			if (err) return res.status(400).send(err);

			res.send(tasks);
		});
	})

	router.post('/tasks', function(req, res){
		// This request create new task for the current user.
		var user_id = req.user._id;		
		var task = new Task(_.extend({user_id}, req.body));
		task.save(function(err, result){
			if(err){
				res.status(400).send(err);
				return;
			}

			res.send(result);
		});
	})

	router.patch('/tasks/:id', function(req, res){
		// This request do partial update on the task.
		var set = req.body;
		Task.update({user_id: req.user._id, _id: req.params.id},{$set: set}, function(err, numAffected) {
			if (err) return res.status(400).send(err);
			res.send(numAffected);
		});
	})

	router.get('/tasks/:id', function(req, res){
		// This request returns error. At this moment, we don't support for this kind of operation.
		res.send('SORRY! You cannot access taskid: ' + req.params.id + '<br/>This not a valid access method.');
	})

	router.delete('/tasks/:id', function(req, res){
		// This request delete specific task.
		Task.remove({user_id: req.user._id, _id: req.params.id}, function(err){
			if (err) return res.status(400).send(err);
			res.send({});
		});
	})
}
