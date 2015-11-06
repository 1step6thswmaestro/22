'use strict'

var mongoose = require('mongoose');
var Timetable = mongoose.model('Timetable');
var Q = require('q');
var _ = require('underscore');

function init(app){
	function TimetableHelper(){

	}

	TimetableHelper.prototype.find = function(user, query, proj, opt){
		opt = opt || {};
		opt.sort = opt.sort || {tableslotStart: 1};
		return Q.nbind(Timetable.find, Timetable)(Object.assign(query), proj, opt);
	}

	TimetableHelper.prototype.createItems = function(userId, list){
		return Q.all(_.map(list, item => this.create(userId, item)))
		.fail(err=>logger.error(err))
	}

	TimetableHelper.prototype.create = function(userId, body){
		let table = new Timetable(_.extend({userId}, body));
		return Q.nbind(table.save, table)()
		.then(function(obj){
			console.log({obj});
			return obj[0];
		})
		.fail(err=>logger.error(err))
	}

	app.helper.timetable = new TimetableHelper();
}

module.exports = init;
