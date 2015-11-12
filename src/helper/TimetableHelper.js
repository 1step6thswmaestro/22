'use strict'

var mongoose = require('mongoose');
var Timetable = mongoose.model('Timetable');
var Q = require('q');
var _ = require('underscore');

function init(app){
	function TimetableHelper(){

	}

	TimetableHelper.prototype.find = function(userId, query, proj, opt){
		opt = opt || {};
		opt.sort = opt.sort || {tableslotStart: 1};
		return Q.nbind(Timetable.find, Timetable)(Object.assign({userId}, query), proj, opt);
	}

	TimetableHelper.prototype.findOne = function(userId, query, proj, opt){
		opt = opt || {};
		return Q.nbind(Timetable.findOne, Timetable)(Object.assign({userId}, query), proj, opt);
	}

	TimetableHelper.prototype.createItems = function(userId, list){
		return Q.all(_.map(list, item => this.create(userId, item)))
		.fail(err=>logger.error(err))
	}

	TimetableHelper.prototype.create = function(userId, body){
		let table = new Timetable(_.extend({userId}, body));
		return Q.nbind(table.save, table)()
		.then(function(obj){
			return obj[0];
		})
		.fail(err=>logger.error(err))
	}

	TimetableHelper.prototype.reset = function(userId) {
		Timetable.remove({userId: userId}, function(err){
			if (err) return err;
		});
	}

	TimetableHelper.prototype.dismiss = function(userId, _id, dismissed, state, opt){
		let findOneAndUpdate = Q.nbind(Timetable.findOneAndUpdate, Timetable);
		return findOneAndUpdate({userId, _id}, {$set: {dismissed}})
		.then(function(timetable){
			timetable.dismissed = dismissed;
			let result = {timetable}
			if(state == 'postpone'){
				result.reset = true;
			}
			if(timetable.taskId!=null)
				return app.helper.taskHelper.setState(userId, timetable.taskId, state, opt)
				.then(_result=>_.extend(result, _result));
			else
				return result;
		})

		;
	}

	app.helper.timetable = new TimetableHelper();
}

module.exports = init;
