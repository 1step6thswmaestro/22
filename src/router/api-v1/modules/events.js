'use strict'

let Q = require('q');
let mongoose = require('mongoose');
let Task = mongoose.model('Task');
let express = require('express');
let EventModel = mongoose.model('Event');

module.exports = function(_router, app){
	let helper = app.helper;
	let router = express.Router();
	_router.use('/event', router);

	router.get('/raw', function(req, res){
		let update = req.query.update == 'true'; //default false
		let reset = req.query.reset != 'false'; //default true
		app.helper.google._fetchCalendarEvents(req.user, {update, reset})
		.then(results=>res.send(results));
	})

	//put /events와 get /events가 다름에 유의
	router.get('/', function(req, res){
		let update = req.query.update == 'true'; //default false
		let reset = req.query.reset != 'false'; //default true
		app.helper.google.getCalendarEvents(req.user, {update, reset})
		.then(results=>res.send(results));
	})

	router.put('/', function(req, res){
		app.helper.google.getCalendarEvents(req.user, {update: true, reset: false})
		.then(results=>res.send(results));
	})
}