'use strict'

var mongoose = require('mongoose');
var Timetable = mongoose.model('Timetable');
var Q = require('q');

function init(app){
	function TimetableHelper(){
	}

	TimetableHelper.prototype.find = function(userId, query, proj, opt){
		opt = opt || {};
		opt.sort = opt.sort || {created: 1};
		return Q.nbind(Timetable.find, Timetable)(Object.assign({userId}, query), proj, opt);
	}

	TimetableHelper.prototype.create = function(userId, body){
		let Timetable = new Timetable(_.extend({userId}, body));
		return Q.nbind(Timetable.save, Timetable)()
		.then(function(obj){
			return obj[0];
		})
	}

	TimetableHelper.prototype.update = function(userId, query, doc){
		return Q.nbind(Timetable.update, Timetable)(Object.assign({userId}, query), {$set: doc});
	}

	TimetableHelper.prototype.findOneAndUpdate = function(userId, query, doc){
		return Q.nbind(Timetable.findOneAndUpdate, Timetable)(Object.assign({userId}, query), {$set: doc});
	}

	app.helper.TimetableHelper = new TimetableHelper();
}

module.exports = init;
