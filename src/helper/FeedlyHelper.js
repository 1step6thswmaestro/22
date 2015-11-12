'use strict'

//https://gist.github.com/d3m3vilurr/5904029

var Feedly = require('feedly').Feedly;
var Q = require('q');
var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var _ = require('underscore');
var Article = mongoose.model('Article');

class FeedlyHelper{
	constructor(app){
		this.config = getConfig('feedly.json');
		this.feedly = new Feedly(this.config[this.config.default]);
	}

	getAuthURL(){
		return this.feedly.getAuthClientRedirectUrl('feedly-auth2-auth');
	}

	clearAuth(user){
		let findByIdAndUpdate = Q.nbind(Account.findByIdAndUpdate, Account);
		return findByIdAndUpdate(user._id, {$unset: {feedly: 1}})
	}

	processAuthCode(user, code){
		return this._processAuthCode(code)
		.then(function(results){
			let findByIdAndUpdate = Q.nbind(Account.findByIdAndUpdate, Account);

			console.log('processAuthCode', results);

			let access_token = results.access_token;
			let refresh_token = results.refresh_token;
			let id = results.id;
			let expireDate = Date.now() + results.expires_in*1000;

			return findByIdAndUpdate(user._id, {$set: {feedly: {id, access_token, refresh_token, expireDate}}})
		})
	}

	_processAuthCode(code){
		let defer = Q.defer();
		this.feedly.getAccessToken(code, {}, (err, refresh_token, results)=>{
			console.log('_processAuthCode', err, refresh_token, results);
			if(err){
				defer.reject(err);
			}
			else{
				defer.resolve(_.extend({refresh_token}, results));
			}
		});
		return defer.promise;
	}

	validateAccessToken(user){
		if(user.feedly.expireDate >= Date.now()){
			// let findByIdAndUpdate = Q.nbind(Account.findByIdAndUpdate, Account);

			return this._refreshToken(user.feedly.refresh_token)
			.then(results=>{
				let access_token = results.access_token;
				let expireDate = Date.now() + results.expires_in*1000;
				return findByIdAndUpdate(user._id, {$set: {feedly: {access_token, expireDate}}})
				.then(function(){
					return access_token;
				})
			})
		}
		else{
			return Q(user.feedly.access_token)
		}
	}

	_refreshToken(code){
		let defer = Q.defer();
		this.feedly.refreshToken(code, {}, (err, refresh_token, results)=>{
			console.log('_refreshToken', err, refresh_token, results);
			if(err){
				defer.reject(err);
			}
			else{
				defer.resolve(results);
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

		var feedly = new Feedly(this.config[this.config.default]);

		return this.validateAccessToken(user)
		.then(access_token=>{
			console.log('_request', access_token);

			var defer = Q.defer();
			feedly.accessToken = access_token;
			feedly[method](params, err=>defer.reject(err), results=>defer.resolve(results));
			return defer.promise;
		})
		.fail(err=>logger.error(err, err.stack))
	}

	_requestRaw(user, url){
		if(!user)
			return Q([]);
		
		var feedly = new Feedly(this.config[this.config.default]);

		return this.validateAccessToken(user)
		.then(access_token=>{
			console.log('_requestRaw', access_token)
		
			var defer = Q.defer();
			feedly.accessToken = user.feedly.access_token;
			feedly.doRequest(feedly.baseUrl + url, err=>defer.reject(err), results=>defer.resolve(results));
			return defer.promise;
		})
		.fail(err=>logger.error(err, err.stack))
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
				articleRaw = _.extend(articleRaw, {type: 0}); // This id differentiates RSS articles from Evernote note.
				
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
	app.helper.feedly = new FeedlyHelper(app);
}
