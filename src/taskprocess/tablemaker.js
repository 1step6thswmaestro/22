'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');

const SLOT_SIZE = 1000*60*30;
const TIMELEVEL_SIZE = 3; //hours

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

	getTimeLevel(task) {
		let remainTime = ((new Date(task.duedate) - Date.now()) / (1000*60*60)).toFixed(1);
		let estimationTime = task.estimation;

		let level = Math.floor((remainTime - estimationTime)/TIMELEVEL_SIZE);

		console.log(task.name, level);
		return level;
	}

	sortByTimelevel(_a, _b) {
		return _a.timelevel-_b.timelevel;
	}

	sortByTime(_a, _b) {
		return _a.tableslotStart-_b.tableslotStart;
	}

	makeNewEvent(_id, _start, _end, _summary) {
		let newVal = {
			userId: _id,
			tableslotStart: _start, 
			tableslotEnd: _end,
			summary: _summary
		}

		return newVal;
	}

	process() {
		let getTimeslot = this.getTimeslot;
		let getTimeLevel = this.getTimeLevel;
		let isTaken = this.isTaken;
		let makeNewEvent = this.makeNewEvent;
		let sortByTime = this.sortByTime;
		let sortByTimelevel = this.sortByTimelevel;

		let now = Math.floor(Date.now()/SLOT_SIZE);
		let timetable = [];

		_.each(this.events, event=>{
			let start = getTimeslot(event.start);
			let end = getTimeslot(event.end);

			let tableEvent = makeNewEvent(this.userId, start, end, event.summary);

			if (!isTaken(this.events, tableEvent))
				timetable.push(tableEvent);
		});

		return Q(this.app.helper.taskHelper.find(this.userId))
		.then(plist=>plist.map(function(task){
			task.timelevel = getTimeLevel(task);
			return task;
		}))
		.then(tasks=>{
			tasks.sort(sortByTimelevel.bind(this));

			_.each(tasks, task=>{
				let start = getTimeslot(task.duedate)-Math.floor((task.estimation*2))-1;
				let end = getTimeslot(task.duedate);

				if (now <= end && end < now + (48*7)) {
					let tableTask = makeNewEvent(this.userId, start, end, task.name);

					if (!isTaken(this.events, tableTask)) timetable.push(tableTask);
				}
			})
		})
		.then(function(){
			timetable.sort(sortByTime);
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
