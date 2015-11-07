'use strict'

let Q = require('q');
let mongoose = require('mongoose');
let Task = mongoose.model('Task');
let express = require('express');


module.exports = function(_router, app){
	let helper = app.helper;
	let router = express.Router();
	_router.use('/evernote', router);

	router.get('/auth', function(req, res){
		// Redirect to Evernote to login into Evernote service.
		app.helper.evernote.getAuthURL(req.user)
		.then((results)=>{
			if (results.oauthToken){
				// store the tokens in the session
				req.session.evernote = {
					oauthToken: results.oauthToken,
					oauthTokenSecret: results.oauthTokenSecret
				};
			}
			res.redirect(results.redirectUrl);
		});
	})

	router.get('/oauthcallback', function(req, res){
		// This function will be automatically callled during OAuth.
		app.helper.evernote.processAuthCode(req.user, req.session.evernote, req.query.oauth_verifier)
		.then((oauthAccessToken)=>{
			req.session.evernote = {
				oauthToken: req.session.evernote.oauthToken,
				oauthTokenSecret: req.session.evernote.oauthTokenSecret,
				oauthAccessToken: oauthAccessToken
			};

			// console.log(req.session.evernote);

			res.redirect('/')
		})
		.fail((err)=>res.send(err.data));
	})

	router.get('/unauth', function(req, res){
		app.helper.evernote.clearAuth(req.user)
		.then(()=>res.send());
	})

	router.get('/notebooklist/list', function(req, res){		
		app.helper.evernote.getNotebookList(req.session.evernote.oauthAccessToken)
		.then(results=>res.send(results))
		.fail(err=>res.send(err));
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

	router.get('/update', function(req, res){
		app.helper.feedly.update(req.user)
		.then(function(results){
			res.send(results);
		})
	})
}
