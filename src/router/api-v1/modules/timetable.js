'use strict'

var mongoose = require('mongoose');
var express = require('express');
var Timetable = mongoose.model('Timetable');
var TableMaker = require('../../../taskprocess/tablemaker');
var Q = require('q');

module.exports = function(_router, app){
	let helper = app.helper;
	let tableMaker = new TableMaker(app);
	let router = express.Router();
	_router.use('/timetable', router);

	router.get('/', function(req, res){
		helper.timetable.find(req.user._id, {userId: req.user._id}, undefined, {sort: {tableslotStart: 1}})
		.then(results=>{
			res.send(results)
		});
	})

	router.get('/make', function(req, res){
		let time = req.query.time?parseInt(req.query.time):Date.now();

		helper.google.getCalendarEventsWeek(req.user, req.query)
		.then(events=>tableMaker.make(req.user._id, events, time))
		.then(list=>{helper.timetable.createItems(req.user._id, list)})
		.then(obj=>res.send(obj))
		.fail(err=>console.log(err));
	})

	router.put('/make', function(req, res){
		let time = req.body.time?parseInt(req.body.time):Date.now();
		console.log(new Date(time));

		helper.google.getCalendarEventsWeek(req.user, {update: true, reset: false, time: time})
		.then(events=>tableMaker.make(req.user._id, events, time))
		.then(list=>{helper.timetable.createItems(req.user._id, list)})
		.then(obj=>res.send(obj))
		.fail(err=>console.log(err, err.stack));
	})

	router.put('/test', function(req, res){
		let time = req.query.time?parseInt(req.body.time):Date.now();

		tableMaker.testData(req.user)
		.then(list=>{res.send(list);})
		.fail(err=>console.log(err));
	})

	router.get('/reset', function(req, res){
		let time = req.query.time?parseInt(req.query.time):Date.now();

		Timetable.remove({userId: req.user._id}, function(err){
			if (err) return res.send(err);
			res.send('complete');
		});
	})

	router.put('/:_id/dismiss/:state?', function(req, res){
		let userId = req.user._id;
		let _id = req.params._id;
		console.log(req.params, req.body);
		app.helper.timetable.dismiss(userId, _id, true, req.params.state||'pause', req.body)
		.then(result=>res.send(result))
		.fail(err=>{logger.error(err, err.stack); res.status(400).send()})
		;
	})

	router.put('/:_id/restore/:state?', function(req, res){
		let userId = req.user._id;
		let _id = req.params._id;
		app.helper.timetable.dismiss(userId, _id, false, req.params.state||'resume', req.body)
		.then(result=>res.send(result))
		.fail(err=>{logger.error(err, err.stack); res.status(400).send()})
		;
	})
}
