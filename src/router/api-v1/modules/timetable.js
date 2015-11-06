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
		helper.timetable.find(req.user._id, {userId: req.user._id})
		.then(results=>res.send(results));
	})

	router.get('/make', function(req, res){
		helper.google.getCalendarEventsWeek(req.user, req.query)
		.then(events=>tableMaker.make(req.user._id, events))
		.then(list=>{helper.timetable.createItems(req.user._id, list)})
		.then(obj=>res.send(obj))
		.fail(err=>console.log(err));
	})

	router.put('/make', function(req, res){
		helper.google.getCalendarEventsWeek(req.user, {update: true, reset: false})
		.then(events=>tableMaker.make(req.user._id, events))
		.then(list=>{helper.timetable.createItems(req.user._id, list)})
		.then(obj=>res.send(obj))
		.fail(err=>console.log(err));
	})

	router.get('/reset', function(req, res){
		Timetable.remove({userId: req.user._id}, function(err){
			if (err) return res.send(err);
			res.send('complete');
		});
	})
}
