'use strict'

var Evernote = require('evernote').Evernote;

var Q = require('q');
var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var _ = require('underscore');
var Article = mongoose.model('Article');

class EvernoteHelper{
	constructor(app){
		this.config = getConfig('evernote.json');
		this.evernote = new Evernote.Client(this.config[this.config.default].client);
	}

	getAuthURL(user){
		let defer = Q.defer();
		let redirectUrl = this.config[this.config.default].redirectUrl; // On success or failure.

		this.evernote.getRequestToken(this.config[this.config.default].callbackUrl, (error, oauthToken, oauthTokenSecret, results)=>{
			if(error){
				oauthToken='';
				oauthTokenSecret='';
				console.log('Error during Evernote getAuthURL().'+ error)
				defer.reject({oauthToken, oauthTokenSecret, redirectUrl});
			}
			else{
				var redirectUrl = this.evernote.getAuthorizeUrl(oauthToken);
				defer.resolve({oauthToken, oauthTokenSecret, redirectUrl});
			}
		});
		return defer.promise;
	}

	processAuthCode(user, sessionEvernote, oauthVerifier){
		let defer = Q.defer();
		this.evernote.getAccessToken(sessionEvernote.oauthToken, sessionEvernote.oauthTokenSecret, oauthVerifier, (error, oauthAccessToken, oauthAccessTokenSecret, results)=>{
			if(error){
				defer.reject(error);
			}
			else{
				defer.resolve(oauthAccessToken);
			}
		});
		return defer.promise;
	}
	getNotebookList(oauthAccessToken){
		let defer = Q.defer();

		var client = new Evernote.Client({token: oauthAccessToken});
		var noteStore = client.getNoteStore();
		noteStore.listNotebooks(function(err, notebooks) {
			if(err){
				defer.reject(err);
			}
			else{
				defer.resolve(notebooks);
			}
		});

		return defer.promise;
	}
}

module.exports = function(app){
	app.helper.evernote = new EvernoteHelper(app);
}
