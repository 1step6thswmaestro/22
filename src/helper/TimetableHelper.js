'use strict'

var mongoose = require('mongoose');
var Timetable = mongoose.model('Timetable');
var Q = require('q');

function init(app){
	function TimetableHelper(){
	}

	TimetableHelper.prototype.find = function(user, query, proj, opt){
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
			let events = results[0];
			let plist = results[1];

			return results;
		});
	}

	app.helper.timetable = new TimetableHelper();
}

module.exports = init;
