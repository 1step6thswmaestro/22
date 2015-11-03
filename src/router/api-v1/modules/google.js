'use strict'

let Q = require('q');
let mongoose = require('mongoose');
let Task = mongoose.model('Task');
let express = require('express');


module.exports = function(_router, app){
	let helper = app.helper;
	let router = express.Router();
	_router.use('/google', router);

	router.get('/auth', function(req, res){
		let redirectTo = app.helper.google.getAuthURL();
		res.redirect(redirectTo)
	})

	router.get('/unauth', function(req, res){
		app.helper.feedly.clearAuth(req.user)
		.then(()=>res.send());
	})

	router.get('/oauthcallback', function(req, res){
		app.helper.google.processAuthCode(req.user, req.query.code)
		.then(()=>res.redirect('/'));
	})

	router.get('/calendarlist/list', function(req, res){
		app.helper.google.getCalendarList(req.user)
		.then(results=>res.send(results));
	})

	router.get('/calendar/list', function(req, res){
		app.helper.google.getCalendarEvents(req.user, req.query)
		.then(results=>res.send(results));
	})

	//this is just for develop test (copy of the below.)
	router.get('/calendar/nextlist', function(req, res){
		app.helper.google.nextCalendarEvents(req.user, req.query)
		.then(results=>res.send(results));
	})

	router.put('/calendar/fetchlist', function(req, res){
		app.helper.google.nextCalendarEvents(req.user)
		.then(results=>res.send(results));
	})

	router.put('/calendarlist/unselect/:id', function(req, res){
		app.helper.google.selectCalendar(req.user, req.params.id, false)
		.then(function(result){
			res.send(result);
		})
	})

	router.put('/calendarlist/select/:id', function(req, res){
		app.helper.google.selectCalendar(req.user, req.params.id, true)
		.then(function(result){
			res.send(result);
		})
	})

	router.get('/calendarlist/selection', function(req, res){
		app.helper.google.getSelectedCalendarIds(req.user)
		.then(function(list){
			console.log({list});
			let result = {};
			_.each(list, item=>{result[item]=true});
			res.send(result);
		})
	})
}