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
				let start = getTimeslot(task.duedate)-Math.floor((task.estimation*2))-1;
				let end = getTimeslot(task.duedate);

				if (now <= end && end < now+48) {

					let tableTask = {
						tableslotStart: start,
						tableslotEnd: end,
						summary: task.name
					}

					timetable.push(tableTask);
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

	testData(user){
		let getTimeslot = this.getTimeslot;
		let now = Math.floor(Date.now()/SLOT_SIZE);
		return this.app.helper.taskHelper.find(user._id)
		.then(tasks => _.map(tasks, task=>{
			let _now = now;
			now += 2;

			return {
				taskId: task._id
				, tableslotStart: _now
				, tableslotEnd: now
				, summary: task.name
				, estimation: task.estimation
			}
		}));

	}
}

module.exports = TimeMaker;
