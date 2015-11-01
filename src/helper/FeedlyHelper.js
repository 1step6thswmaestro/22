'use strict'

//https://gist.github.com/d3m3vilurr/5904029

var Feedly = require('feedly').Feedly;
var fs = require('fs');
var Q = require('q');
var mongoose = require('mongoose');
var Account = mongoose.model('Account');

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

}

module.exports = function(app){
	app.helper.feedly = new FeedlyHelper(app);
}