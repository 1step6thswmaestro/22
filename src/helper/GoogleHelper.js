'use strict'

// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
// https://github.com/google/google-api-nodejs-client/
// https://security.google.com/settings/u/0/security/permissions?pli=1

var Q = require('q');
var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var EventModel = mongoose.model('Event');
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

	getOAuth(user, oauth){
		return oauth || this.refreshToken(user);
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

	getCalendar(user, calendarId, oauth){
		return this.getOAuth(user, oauth)
		.then(oauth => {
			var calendar = google.calendar({ version: 'v3', auth: oauth });
			return Q.nbind(calendar.calendarList.get, calendar.calendarList)({calendarId})
			.fail(err=>logger.error(err));
		})
	}

	getCalendarList(user, oauth){
		return this.getOAuth(user, oauth)
		.then(oauth => {
			var calendar = google.calendar({ version: 'v3', auth: oauth });
			return Q.nbind(calendar.calendarList.list, calendar.calendarList)({})
			.fail(err=>logger.error(err));
		})
	}

	getCalendarEvents(user, opt){
		opt = opt || {};
		let find = Q.nbind(EventModel.find, EventModel);

		return this.getSelectedCalendarIds(user)
		.then(list=>{
			console.log({list});
			if(opt.update){
				return this._updateCalendarEvents(user, opt)
				.then(()=>find({userId: user._id, calendarId: {$in: list}}, undefined, {sort: {start: 1}}));
			}
			else{
				return find({userId: user._id, calendarId: {$in: list}}, undefined, {sort: {start: 1}});
			}
		})

	}

	_updateCalendarEvents(user, opt){
		opt = opt || {};

		let update = true;
		let reset = false;
		if(opt.update !== undefined)
			update = opt.update;
		if(opt.reset !== undefined)
			reset = opt.reset;

		return this._fetchCalendarEvents(user, {update, reset})
	}

	_fetchCalendarEvents(user, opt){
		opt = opt || {};
		
		let reset = opt.reset;
		let saveSyncToken = false;
		let save = false;
		
		if(opt.update == true){
			saveSyncToken = true;
			save = true;
		}

		return this.getSelectedCalendars(user)
		.then(list=>{
			return Q.all(_.map(list, item=>{
				let promise = this.__getCalendarEventsFromGoogle(user, null, item.id, !reset&&item.nextSyncToken, {saveSyncToken: saveSyncToken})
				.then(result=>{
					let items = result.items;
					return _.map(items, item => _.pick(item, 'id', 'summary', 'created', 'start', 'end'))
				});

				if(save){
					promise = promise.then(this.__saveCalenderEvents.bind(this, user, item.id))
					.fail(err=>logger.error(err));
				}

				return promise;
			}))
			.then(results=>_.flatten(results))
			.fail(err=>logger.error(err))
			
		})


		return promise;
	}

	__getCalendarEventsFromGoogle(user, oauth, calendarId, syncToken, opt){
		function updateNextSyncToken(result){
			let nextSyncToken = result.nextSyncToken;
			var update = Q.nbind(Account.update, Account);
			return update({_id: user._id, 'thirdparty.google.calendars.id': calendarId}, {'thirdparty.google.calendars.$.nextSyncToken': nextSyncToken}, {multi: true})
			.then(()=>result)
		}

		return this.refreshToken(user)
		.then(oauth => {
			var calendar = google.calendar({ version: 'v3', auth: oauth });
			var params = {calendarId};
			if(syncToken){
				params.syncToken = syncToken;
			}

			return Q.nbind(calendar.events.list, calendar.events)(params)
			.then(results=>results[0])
			.then(result=>{
				if(opt && opt.saveSyncToken){
					return updateNextSyncToken(result);
				}
				else{
					return result;
				}
			})
			// .then(result=>{console.log(result); return result;})
			.fail(err=>logger.error(err));
		})
	}

	__saveCalenderEvents(user, calendarId, items){
		let __saveCalenderEvent = this.__saveCalenderEvent.bind(this, user, calendarId);
		return Q.all(_.map(items, __saveCalenderEvent));
	}

	__saveCalenderEvent(user, calendarId, item){
		var raw = _.pick(item, 'id', 'summary', 'created', 'start', 'end');
		raw.start = item.start.dateTime || item.start.date;
		raw.end = item.end.dateTime || item.end.date;
		raw.fullday = item.start.date!=undefined || item.end.date!=undefined;
		raw.userId = user._id;
		raw.calendarId = calendarId;

		var findOneAndUpdate = Q.nbind(EventModel.findOneAndUpdate, EventModel);
		return findOneAndUpdate({id: raw.id}, raw, {upsert: true});
	}

	selectCalendar(user, calendarId, selected){
		function updateAccount(item){
			let findByIdAndUpdate = Q.nbind(Account.findByIdAndUpdate, Account);
			if(selected){
				return findByIdAndUpdate(user._id, {$addToSet: {'thirdparty.google.calendars': item}});
			}
			else{
				return findByIdAndUpdate(user._id, {$pull: {'thirdparty.google.calendars': {id: calendarId}}}, {multi: true});
			}
		}	

		return this.getCalendar(user, calendarId)
		.then(function(items){
			return items[0];
		})
		.then(updateAccount)
		.then(()=>this.getSelectedCalendarIds(user))
		.then(function(list){
			return {
				id: calendarId
				, selected: list.indexOf(calendarId)>=0
			}
		})
		.fail(err=>logger.error(err))
		;
	}

	getSelectedCalendars(user){
		let findById = Q.nbind(Account.findById, Account);
		return findById(user._id, {'thirdparty.google.calendars': 1})
		.then(function(_user){
			try{
				return _user.thirdparty.google.calendars;
			}
			catch(e){
				return {};
			}
		})
	}

	getSelectedCalendarIds(user){
		return this.getSelectedCalendars(user)
		.then(function(calendars){
			return _.map(calendars, item=>item.id);
		})
	}

}

module.exports = function(app){
	app.helper.google = new GoogleHelper(app);
}