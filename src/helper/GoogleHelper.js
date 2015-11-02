'use strict'

// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
// https://github.com/google/google-api-nodejs-client/
// https://security.google.com/settings/u/0/security/permissions?pli=1

var Q = require('q');
var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var _ = require('underscore');

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

class GoogleHelper{
	constructor(app){
		let _config = getConfig('google.json');
		this.config = _config[_config.default];
		this.oauth = new OAuth2(this.config.clientId, this.config.clientSecret, this.config.redirectUrl);

		// generate a url that asks permissions for Google+ and Google Calendar scopes
		var scopes = [
		  'https://www.googleapis.com/auth/plus.me',
		  'https://www.googleapis.com/auth/calendar'
		];
	}

	getAuthURL(){
		let url = this.oauth.generateAuthUrl({
		  access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
		  scope: this.config.scopes // If you only need one scope you can pass it as string
		});
		console.log({url});
		return url;
	}

	clearAuth(user){
		let findByIdAndUpdate = Q.nbind(Account.findByIdAndUpdate, Account);
		return findByIdAndUpdate(user._id, {$unset: {'thirdparty.google': 1}})
	}

	processAuthCode(user, code){
		return this._processAuthCode(code)
		.then(results => {
			console.log('saved : ', {results});

			return this._saveToken(user, results);
		})
	}

	_saveToken(user, token){
		let findByIdAndUpdate = Q.nbind(Account.findByIdAndUpdate, Account);
		let user_google = {};
		try{
			user_google = user.thirdparty.google
		}
		catch(e){

		}

		token.refresh_token = token.refresh_token || (user_google && user_google.auth.refresh_token);

		return findByIdAndUpdate(user._id, {$set: {'thirdparty.google.auth': token}})
		.then(results=>true)
		.fail(err=>false)
	}

	_processAuthCode(code){
		let defer = Q.defer();
		this.oauth.getToken(code, (err, access_token)=>{
			if(err){
				defer.reject(err);
			}
			else{
				defer.resolve(access_token);
			}
		});
		return defer.promise;
	}

	refreshToken(user){
		let auth;
		try{
			auth = user.thirdparty.google.auth;
		}
		catch(e){
			return Q(undefined);
		}

		let oauth2Client = new OAuth2(this.config.clientId, this.config.clientSecret, this.config.redirectUrl);
		oauth2Client.setCredentials(auth);

		let refreshAccessToken = Q.nbind(oauth2Client.refreshAccessToken, oauth2Client);
		return refreshAccessToken()
		.then(results=>{
			console.log('refresh', results[0]);
			this._saveToken(user, results[0]);
			return oauth2Client;
		})
	}

	list(user){
		return this.refreshToken(user)
		.then(oauth => {
			var calendar = google.calendar({ version: 'v3', auth: oauth });
			return Q.nbind(calendar.calendarList.list, calendar.calendarList)({})
			.fail(err=>logger.error(err));
		})
	}

	selectCalendar(user, calId, selected){
		function updateAccount(){
			let findByIdAndUpdate = Q.nbind(Account.findByIdAndUpdate, Account);
			if(selected){
				return findByIdAndUpdate(user._id, {$addToSet: {'thirdparty.google.calendars': calId}})
			}
			else{
				return findByIdAndUpdate(user._id, {$pull: {'thirdparty.google.calendars': calId}})
			}
		}	

		return updateAccount()
		.then(()=>this.getSelectedCalendars(user))
		.then(function(list){
			console.log(list);
			return {
				id: calId
				, selected: list.indexOf(calId)>=0
			}
		})
		.fail(err=>logger.error(err))
		;
	}

	getSelectedCalendars(user){
		let findById = Q.nbind(Account.findById, Account);
		return findById(user._id, {'thirdparty.google.calendars': 1})
		.then(function(_user){
			console.log(_user);
			try{
				return _user.thirdparty.google.calendars;
			}
			catch(e){
				return [];
			}
		})
	}

}

module.exports = function(app){
	app.helper.google = new GoogleHelper(app);
}