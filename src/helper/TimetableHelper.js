'use strict'

var mongoose = require('mongoose');
var Timetable = mongoose.model('Timetable');
var Q = require('q');

function init(app){
	function TimetableHelper(){

	}

	TimetableHelper.prototype.find = function(user, query, proj, opt){
		
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
