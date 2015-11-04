'use strict'

var mongoose = require('mongoose');
var Timetable = mongoose.model('Timetable');
var Q = require('q');

module.exports = function(router, app){
	let helper = app.helper;

	router.get('/timetable', function(req, res){
		helper.timetable.find(req.user, req.query)
		.then(list=>res.send(list));
	})

	router.put('/timetable', function(req, res){
		helper.timetable.find(req.user, {update: true, reset: false})
		.then(results=>res.send(results));
	})

/*
	router.get('/events', function(req, res){
		let update = req.query.update == 'true'; //default false
		let reset = req.query.reset != 'false'; //default true
		app.helper.google.getCalendarEvents(req.user, {update, reset})
		.then(results=>res.send(results));
	})

	router.put('/events', function(req, res){
		app.helper.google.getCalendarEvents(req.user, {update: true, reset: false})
		.then(results=>res.send(results));
	})*/
}
