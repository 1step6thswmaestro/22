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

	clearAuth(user){
		// user: MongoDB Acount Model.
		let findByIdAndUpdate = Q.nbind(Account.findByIdAndUpdate, Account);
		return findByIdAndUpdate(user._id, {$unset: {evernote: 1}})
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

	getSubscription(user, params){
		return this._request(user, 'getSubscriptions');
	}

	getCategory(user){
		return this._request(user, 'getCategories');
	}

	getFeed(user, params){
		return this._request(user, 'getFeed', params)
	}

	getStream(user, params){
		return this._request(user, 'getStreamContents', params);
	}

	_request(user, method, params){
		if(!user)
			return Q([]);

		var defer = Q.defer();

		var feedly = new Feedly(this.config[this.config.default]);
		feedly.accessToken = user.feedly.access_token;
		feedly[method](params, err=>defer.reject(err), results=>defer.resolve(results));

		return defer.promise;
	}

	_requestRaw(user, url){
		if(!user)
			return Q([]);

		var defer = Q.defer();


		var feedly = new Feedly(this.config[this.config.default]);
		feedly.accessToken = user.feedly.access_token;
		console.log(feedly.baseUrl + url)
		feedly.doRequest(feedly.baseUrl + url, err=>defer.reject(err), results=>defer.resolve(results));

		return defer.promise;
	}

	update(user){
		let streamId = `user/${user.feedly.id}/category/global.all`

		let params = {streamId};
		if(user.feedly && user.feedly.date){
			params.newerThan = new Date(user.feedly.date).getTime();
		}
		else{
			params.count = 1000;
		}

		return this.getStream(user, params)
		.then(results=>{
			results = JSON.parse(results);
			console.log(results.items[0])
			var articles = _.map(results.items, item=>_.pick(item, 'title', 'content', 'originId', 'summary'));
			return articles;
		})
		.then(function(articles){
			var promises = _.map(articles, articleRaw=>{
				articleRaw.userId = user._id;
				if(articleRaw.content && articleRaw.content.content)
					articleRaw.content = articleRaw.content.content;
				if(articleRaw.summary && articleRaw.summary.content)
					articleRaw.summary = articleRaw.summary.content;
				var article = new Article(articleRaw);
				return Q.nbind(article.save, article)()
				.fail(err=>undefined);
			})

			return Q.all(promises);
		})
		.then(function(results){
			let findByIdAndUpdate = Q.nbind(Account.findByIdAndUpdate, Account);
			return findByIdAndUpdate(user._id, {$set: {'feedly.date': Date.now()}})
			.then(function(result){

			})
			.fail(err=>console.error(err))
		})
		.fail(err=>logger.error)
	}

}

module.exports = function(app){
	app.helper.evernote = new EvernoteHelper(app);
}
