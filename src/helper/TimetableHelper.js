'use strict'

var mongoose = require('mongoose');
var Timetable = mongoose.model('Timetable');
var Q = require('q');

function init(app){
	function TimetableHelper(){
	}

	TimetableHelper.prototype.find = function(user, query, proj, opt){
		function getTodayEvent(events) {
			var _events = [];

			_.each(events, event=>{
				if (Date.now()+(1000*60*60*24) >= event.start.getTime() && event.start.getTime() >= Date.now()) {
					_events.push(event);
				}
			});

			return _events;
		}

		opt = opt || {};
		opt.sort = opt.sort || {created: 1};

		let update = query.update == 'true'; //default false
		let reset = query.reset != 'false'; //default true
		let time = query.time?parseInt(query.time):Date.now();
		return Q.all([
			app.helper.google.getCalendarEvents(user, {update, reset}),
			app.helper.priTaskHelper.find(user._id, undefined, time)
		])
		.then(results=>{
			let events = getTodayEvent(results[0]);
			let plist = results[1];

			return events;
		});
	}

	app.helper.timetable = new TimetableHelper();
}

module.exports = init;
