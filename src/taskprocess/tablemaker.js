'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');

const SLOT_SIZE = 1000*60*30;

class TimeMaker{

	constructor(app) {
		this.app = app;
	}

	isTaken(events, _event) {
		let starttime = _event.tableslotStart;
		let endtime = _event.tableslotEnd;
		let result = false;
		_.each(events, event=>{
			if (event.start.getTime() <= starttime && starttime <= event.end.getTime()
				&& event.start.getTime() <= endtime && endtime <= event.end.getTime())
				result = true;
		});
		return result;
	}

	getTimeslot(time) {
		return Math.floor(time.getTime()/SLOT_SIZE);
	}

	process() {
		let getTimeslot = this.getTimeslot;
		let isTaken = this.isTaken;

		let now = Math.floor(Date.now()/SLOT_SIZE);
		let timetable = [];

		_.each(this.events, event=>{
			let start = getTimeslot(event.start);
			let end = getTimeslot(event.end);

			let tableEvent = {
				userId: this.userId,
				tableslotStart: start,
				tableslotEnd: end,
				summary: event.summary
			}

			if (!isTaken(this.events, tableEvent)) timetable.push(tableEvent);
		});

		return Q(this.app.helper.priTaskHelper.find(this.userId, undefined, now))
		.then(plist=>plist.map(function(task){
			return task;
		}))
		.then(tasks=>{
			_.each(tasks, task=>{
				let start = getTimeslot(task.duedate)-Math.floor((task.estimation*2))-1;
				let end = getTimeslot(task.duedate);

				if (now <= end && end < now+48) {

					let tableTask = {
						userId: this.userId,
						tableslotStart: start,
						tableslotEnd: end,
						summary: task.name
					}

				if (!isTaken(this.events, tableTask)) timetable.push(tableTask);
				}
			})
		})
		.then(function(){
			timetable.sort(function(a, b){
				return a.tableslotStart-b.tableslotStart;
			});
			return timetable;
		});
	}

	make(userId, events) {
		this.events = events;
		this.userId = userId;

		return Q(this.process());
	}
}

module.exports = TimeMaker;
