'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');

const SLOT_SIZE = 1000*60*30;
const SLOT_NUMBER = 48*7;
const TIMELEVEL_SIZE = 3; //hours

class TimeMaker{

	constructor(app) {
		this.app = app;
	}

	isTaken(pushedTask, _event) {
		let starttime = _event.tableslotStart;
		let endtime = _event.tableslotEnd;
		let result = false;
		_.each(pushedTask, task=>{
			if ((task.tableslotStart <= starttime && starttime <= task.tableslotEnd)
				|| (task.tableslotStart <= endtime && endtime <= task.tableslotEnd))
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

			if (!isTaken(timetable, tableEvent))
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
				let level = task.timelevel;

				if (0 <= level && level < (24*7/(TIMELEVEL_SIZE))) {
					let timePreferenceScore = task.timePreferenceScore;
					let timespan = Math.floor(task.estimation*2);

					let score = [];

					// Calculate time prefer score for each slot term
					for (let i = 0; i < SLOT_NUMBER; i++) {
						let _score = 0;
						for (let j = 0; j < timespan; j++) {
							_score += timePreferenceScore[(i+j)%SLOT_NUMBER];
						}
						score.push({idx: i, score: _score});
					}

					score.sort(function(a, b){
						return a.score - b.score;
					});

					// Checkout if the task's prefer slot is taken by the other
					let tableTask = null;
					for (let i = 0; i < SLOT_NUMBER; i++) {
						let idx = score[i].idx;

						let _now = new Date(Date.now());
						let weekday = _now.getDay();
						let h = _now.getHours();
						let m = _now.getMinutes();

						let idx_now = weekday * 48 + h * 2 + Math.floor(m / 30);
						let offset = idx_now - idx;
						if(offset < 0){
							offset += 48*7;
						}

						let start = now + offset;
						let end = now + offset + timespan;

						tableTask = makeNewEvent(this.userId, start, end, task.name);

						if(!isTaken(timetable, tableTask)) break;
					}

					if (tableTask) {
						timetable.push(tableTask);
					}
					
					let start = getTimeslot(task.duedate)-Math.floor((task.estimation*2))-1;
					let end = getTimeslot(task.duedate);
				}
			})
		})
		.then(function(){
			timetable.sort(sortByTime);
			return timetable;
		});
	}

	make(userId, events) {
		let helper = this.app.helper;
		this.events = events;
		this.userId = userId;

		// Now tablemaker remove all timetable for every requests.
		return Q(helper.timetable.reset(userId))
		.then(function(){ return this.process() }.bind(this));
	}
}

module.exports = TimeMaker;
