'use strict'

var mongoose = require('mongoose');
var Timetable = mongoose.model('Timetable');
var Q = require('q');

function init(app){
	function TimetableHelper(){

	}

	TimetableHelper.prototype.find = function(user, query, proj, opt){
		let now = null;
		let events = null;

		function getTodayEvent(events) {
			var _events = [];

			_.each(events, event=>{
				if (now+(1000*60*60*24) >= event.start.getTime() && event.start.getTime() >= now) {
					_events.push(event);
				}
			});

			return _events;
		}

		now = Date.now();
		now = now - now%(1000*60*30);

		opt = opt || {};
		opt.sort = opt.sort || {created: 1};

		let update = query.update == 'true'; //default false
		let reset = query.reset != 'false'; //default true
		let time = query.time?parseInt(query.time):Date.now();
		return Q(app.helper.google.getCalendarEvents(user, {update, reset}))
		.then(results=>{
			events = getTodayEvent(results);
			return events;
		});
	}

	TimetableHelper.prototype.create = function(userId, body){
		let table = new Timetable(_.extend({userId}, body));
		return Q.nbind(table.save, table)()
		.then(function(obj){
			return obj[0];
		})
	}

	app.helper.timetable = new TimetableHelper();
}

module.exports = init;
