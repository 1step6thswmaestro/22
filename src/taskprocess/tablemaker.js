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
		return Math.floor((time.getTime?time.getTime():time)/SLOT_SIZE);
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

	makeNewEvent(userId, taskId, _start, _end, _summary, _estimation) {
		let newVal = {
			userId,
			taskId,
			tableslotStart: _start, 
			tableslotEnd: _end,
			summary: _summary,
			estimation: _estimation
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

		let now = getTimeslot(Date.now());
		let timetable = [];

		_.each(this.events, event=>{
			let start = getTimeslot(event.start);
			let end = getTimeslot(event.end);

			let tableEvent = makeNewEvent(this.userId, undefined, start, end, event.summary, 0);

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
				let slot_begin = now%SLOT_NUMBER;
				let slot_size = SLOT_NUMBER;
				let timespan = Math.floor(task.estimation*2);
				let timePreferenceScore = task.timePreferenceScore;
				
				if(getTimeslot(task.duedate)-now<SLOT_NUMBER){
					slot_size = getTimeslot(task.duedate)-now;

					
					if(slot_size < timespan)	//only possible when 'adjustable' set
						timespan = slot_size;

					console.log({timespan, slot_size});
				}

				console.log(task.name, task.adjustable, level, {now, slot_begin, slot_size});

				if (task.adjustable || (0 <= level && level < (24*7/TIMELEVEL_SIZE))) {
					let score = [];

					// Calculate time prefer score for each slot term
					for (let i = 0; i <= slot_size-timespan; ++i) {
						let slot = (now+i)%SLOT_NUMBER;
						let _score = 0;
						for (let j = 0; j < timespan; j++) {
							_score += timePreferenceScore[(slot+j)%SLOT_NUMBER] || 0;
						}
						score.push({slot: now+i, score: _score});
					}


					score.sort(function(a, b){
						return a.score - b.score;
					});

					// Checkout if the task's prefer slot is taken by the other
					let tableTask = null;
					for (let i = 0; i < score.length; i++) {
						let slot = score[i].slot;

						let start = slot;
						let end = slot + timespan;

						tableTask = makeNewEvent(this.userId, task._id, start, end, task.name, task.estimation);

						if(!isTaken(timetable, tableTask)) {
							console.log({now, score: score[i]});
							console.log(tableTask);
							console.log({start, end});
							break;
						}
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
