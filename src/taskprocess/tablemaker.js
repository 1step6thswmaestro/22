'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');
var SlotAllocator = require('./SlotAllocator');

const SLOT_SIZE = 1000*60*30;
const HOUR_MILLISEC = 1000*60*60;
const SLOT_NUMBER = 48*7;
const TIMELEVEL_SIZE = 4; //hours

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
		let remainTime = ((new Date(task.duedate) - Date.now()) / HOUR_MILLISEC).toFixed(1);
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

	getProcessedTime(logs) {
		let takenTime = 0;

		let lognum;
		if(!logs) {
			lognum = -1;
		}
		else {
			lognum = logs.length;
		}

		let to = -1;
		let processed = false;
		while (--lognum > 0) {
			let logType = logs[lognum].type;
			if(logType == 300 || logType == 400) {
				to = lognum;
				processed = true;
			}
			else if ((logType == 200 || logType == 350) && processed) {
				let timeTo = new Date(logs[to].time);
				let timeFrom = new Date(logs[lognum].time);
				takenTime += timeTo - timeFrom;
				processed = false;
			}
		}

		takenTime /= HOUR_MILLISEC;

		if (takenTime > 365*24) return 365*24;
		return takenTime.toFixed(1);
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

	process(currentTime) {
		let helper = this.app.helper;
		let getTimeslot = this.getTimeslot;
		let getTimeLevel = this.getTimeLevel;
		let getProcessedTime = this.getProcessedTime;
		let isTaken = this.isTaken;
		let makeNewEvent = this.makeNewEvent;
		let sortByTime = this.sortByTime;
		let sortByTimelevel = this.sortByTimelevel;
		let now = getTimeslot(currentTime||Date.now());
		let slotAllocator = new SlotAllocator(now, SLOT_NUMBER);
		let timetable = [];

		_.each(this.events, event=>{
			let start = getTimeslot(event.start);
			let end = getTimeslot(event.end);

			let allocation = slotAllocator.alloc(start, end, false);
			if(allocation == 0){
				console.log('cannot alloc event.');
			}

			let tableEvent = makeNewEvent(this.userId, undefined, start, end, event.summary, 0);
			timetable.push(tableEvent);
		});

		return Q(helper.taskHelper.find(this.userId))
		.then(plist=>Q.all(plist.map(function(task){
			let taskId = task._id.toString();
			task.timelevel = getTimeLevel(task);
			return Q(helper.tasklog.find(task.userId, {taskId}))
			.then(logs=>{
				task.processedtime = getProcessedTime(logs) || 0;
				return task;
			})
		})))
		.then(tasks=>{
			tasks.sort(sortByTimelevel.bind(this));

			_.chain(tasks)
			.groupBy('timelevel')
			.map(function(tasks, level) {
				_.each(tasks, task=>{
					let level = task.timelevel;
					let slot_begin = now%SLOT_NUMBER;
					let slot_size = SLOT_NUMBER;
					let timespan = Math.max(Math.floor(task.estimation*2 - task.processedtime),0);
					timespan += (task.marginBefore||0) + (task.marginAfter||0);

					let timePreferenceScore = task.timePreferenceScore;
					let slot_due = getTimeslot(task.duedate);
					
					if(slot_due-now<SLOT_NUMBER){
						slot_size = slot_due-now;
					}

					console.log(task.name, task.adjustable, level, {now, slot_begin, slot_size, timespan});
					// console.log(timePreferenceScore.length);

					if (task.adjustable || (0 <= level && level < (24*7/TIMELEVEL_SIZE))) {
						// Calculate time prefer score for each slot term

						let scores = [];
						for (let i = 0; i <= slot_size-(task.adjustable?1:timespan); ++i) {
							let slot = now+i;

							let start = slot;
							let _timespan = timespan;

							if(slot_due - start < _timespan)	//only possible when 'adjustable' set
								_timespan = slot_due-start;
							
							let end = slot + _timespan;
							let allocation = slotAllocator.test(start, end, task.adjustable);
							end = start + allocation;

							if(allocation>0 || timespan==0){
								let score = 0;
								for (let j = 0; j < allocation; j++) {
									score += timePreferenceScore[(start+j)%SLOT_NUMBER] || 0;
								}
								scores.push({start, end, score, length: allocation});
							}
						}

						scores.sort(function(a, b){
							if(a.end != b.end)
								return b.end - a.end;
							
							if(a.length != b.length)
								return b.length - a.length;

							return b.score - a.score;
						});
						
						// Checkout if the task's prefer slot is taken by the other
						for (let i = 0; i < scores.length; i++) {
							let scoreObj = scores[i];
							let start = scoreObj.start;
							let end = scoreObj.end;
							let score = scoreObj.score;
							let allocation = slotAllocator._alloc(start, end);

							if(allocation>0 || timespan==0){
								let tableTask = makeNewEvent(this.userId, task._id, start+task.marginBefore||0, end-task.marginAfter||0, task.name, task.estimation);
								if (tableTask) {
									timetable.push(tableTask);
									break;
								}
							}
						}					
					}
				})
			}.bind(this));
		})
		.then(function(){
			timetable.sort(sortByTime);
			return timetable;
		});
	}

	make(userId, events, currentTime) {
		let helper = this.app.helper;
		this.events = events;
		this.userId = userId;

		// Now tablemaker remove all timetable for every requests.
		return Q(helper.timetable.reset(userId))
		.then(function(){ return this.process(currentTime) }.bind(this));
	}
}

module.exports = TimeMaker;
