'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');

const SLOT_SIZE = 1000*60*30;

class TimeMaker{

	constructor(app) {
		this.app = app;
	}

	isTaken(slottime) {
		let result = false;
		_.each(events, event=>{
			if (event.start.getTime() <= slottime && slottime <= event.end.getTime())
				result.true;
		});
		return result;
	}

	getTimeslot(time) {
		return Math.floor(time.getTime()/SLOT_SIZE);
	}

	process() {
		let getTimeslot = this.getTimeslot;
		let now = Math.floor(Date.now()/SLOT_SIZE);
		let timetable = [];

		_.each(this.events, event=>{
			let start = getTimeslot(event.start);
			let end = getTimeslot(event.end);

			let tableEvent = {
				tableslotStart: start,
				tableslotEnd: end,
				summary: event.summary
			}

			timetable.push(tableEvent);
		});

		return Q(this.app.helper.priTaskHelper.find(this.userId, undefined, now))
		.then(plist=>plist.map(function(task){
			return task;
		}))
		.then(tasks=>{
			_.each(tasks, task=>{
				let start = getTimeslot(task.duedate)
				let end = getTimeslot(task.duedate)

				if (now <= end && end < now+48) {

					let tableTask = {
						tableslotStart: start-4,
						tableslotEnd: end,
						summary: task.name
					}

					timetable.push(tableTask);
				}
			})
		})
		.then(function(){return timetable;});
	}

	make(userId, events) {
		this.events = events;
		this.userId = userId;

		return Q(this.process());

		//return Q(app.helper.priTaskHelper.find(userId, undefined))
		//.then(plist=>Q(this.process(userId, plist)))
		//.fail(err=>{console.log(err)})
	}
}

module.exports = TimeMaker;
