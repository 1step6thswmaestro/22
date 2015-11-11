'use strict'

let Q = require('q');
let mongoose = require('mongoose');
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
				// console.log('Oauth Seccess. Now you can get auth link from Evernote.')
				// store the tokens in the session
				req.session.evernote = {
					oauthToken: results.oauthToken,
					oauthTokenSecret: results.oauthTokenSecret
				};
			}
			// If getting oauthToken was success, redirect to evernote auth url.
			// Or, redirect to main page.
			res.redirect(results.redirectUrl);
		})
		.fail((err)=>{
			res.send(err);
		});
	})

	router.get('/oauthcallback', function(req, res){
		// This function will be automatically callled during OAuth.
		app.helper.evernote.processAuthCode(req.user, req.session.evernote, req.query.oauth_verifier)
		.then((oauthAccessToken)=>{
			// Save oauthAccessToken.
			// console.log('Oauth Seccess. Now you can get access to the user\'s Evernote.');
			// console.log('oatuh access token: ', oauthAccessToken);
			req.session.evernote = {
				oauthToken: req.session.evernote.oauthToken,
				oauthTokenSecret: req.session.evernote.oauthTokenSecret,
				oauthAccessToken: oauthAccessToken
			};

			res.redirect('/v1/evernote/pushtodb')
		})
		.fail((err)=>res.send(err.data));
	})

	router.get('/pushtodb', function(req, res){
		// Push every notes in the evernote account into Article DB.
		// This function will be automatically callled during OAuth.
		// console.log('start Evernote DB push with this info:', req.session.evernote);

		app.helper.evernote.getNoteList(req.session.evernote.oauthAccessToken)
		.then(noteList=>{
			app.helper.evernote.makeNoteList2Article(req.session.evernote.oauthAccessToken, req.user, noteList);
			res.redirect('/');
		})
		.fail(err=>res.send(err));
	})

	router.get('/unauth', function(req, res){
		// Drop session data for Evernote.
		req.session.evernote = {};
		res.redirect('/');
	})

	router.get('/notebooklist/list', function(req, res){
		// console.log('Evernote Session:', req.session.evernote)
		app.helper.evernote.getNotebookList(req.session.evernote.oauthAccessToken)
		.then(results=>res.send(results))
		.fail(err=>res.send(err));
	})

	router.get('/note/list', function(req, res){
		app.helper.evernote.getNoteList(req.session.evernote.oauthAccessToken)
		.then(results=>res.send(results))
		.fail(err=>res.send(err));
	})

	router.get('/update', function(req, res){
		// Update any changes of saved notes.
		app.helper.evernote.update(req.user)
		.then(function(results){
			res.send(results);
		})
	})
}
