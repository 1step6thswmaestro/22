'use strict'

//https://gist.github.com/d3m3vilurr/5904029

var Feedly = require('feedly').Feedly;
var fs = require('fs');
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

	processAuthCode(user, code){
		return this._processAuthCode(code)
		.then(function(results){
			let findByIdAndUpdate = Q.nbind(Account.findByIdAndUpdate, Account);

			let access_token = results.access_token;
			let id = results.id;

			console.log({id, access_token});

			return findByIdAndUpdate(user._id, {$set: {feedly: {id, access_token}}})
			.then(results=>{
				console.log({results});
			})
		})
	}

	_processAuthCode(code){
		let defer = Q.defer();
		this.feedly.getAccessToken(code, {}, (err, access_token)=>{
			if(err){
				defer.reject(err);
			}
			else{
				defer.resolve(access_token);
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
	app.helper.feedly = new FeedlyHelper(app);
}