'use strict'

let Q = require('q');
let mongoose = require('mongoose');
let Task = mongoose.model('Task');
let express = require('express');


module.exports = function(_router, app){
	let helper = app.helper;
	let router = express.Router();
	_router.use('/feedly', router);

	router.get('/auth', function(req, res){
		let redirectTo = app.helper.feedly.getAuthURL();
		res.redirect(redirectTo)
	})

	router.get('/unauth', function(req, res){
		app.helper.feedly.clearAuth(req.user)
		.then(()=>res.send());
	})

	router.get('/subscription', function(req, res){
		app.helper.feedly.getSubscription(req.user)
		.then(function(results){
			console.log(results);
			res.send(results);
		})
		.fail(function(err){
			res.status(400).send(err);
		})
	})

	router.get('/category', function(req, res){
		app.helper.feedly.getCategory(req.user)
		.then(function(results){
			res.send(results);
		})
		.fail(function(err){
			res.status(400).send(err);
		})
	})

	function getStream(user, res, streamId){
		app.helper.feedly.getStream(user, {count: 30, streamId})
		.then(function(results){
			results = JSON.parse(results);
			res.send(results.items);
		})
		.fail(function(err){
			res.status(400).send(err);
		})
	}

	router.get('/stream/global', function(req, res){
		let user = req.user;
		let streamId = `user/${user.feedly.id}/category/global.all`
		getStream(user, res, streamId);
	})

	router.get('/stream/:streamId?', function(req, res){
		let user = req.user;
		let streamId = req.params.streamId;
		streamId = streamId || "user/2713debc-1be0-4773-b349-fe3955a50590/category/심심풀이 땅콩"

		getStream(user, res, streamId);
	})

	router.get('/feed/:feedId', function(req, res){
		let feedId = req.params.feedId;
		feedId = "feed/http://feeds.engadget.com/weblogsinc/engadget";

		feedId = encodeURIComponent(feedId);

		app.helper.feedly.getFeed(req.user, {feedId})
		.then(function(results){
			res.send(results);
		})
		.fail(function(err){
			res.status(400).send(err);
		})
	})

	router.get('/update', function(req, res){
		app.helper.feedly.update(req.user)
		.then(function(results){
			res.send(results);
		})
	})
}