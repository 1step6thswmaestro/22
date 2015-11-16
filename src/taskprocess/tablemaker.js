'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');
var SlotAllocator = require('./SlotAllocator');
var TaskStateType = require('../constants/TaskStateType');

const SLOT_SIZE = 1000*60*30;
const HOUR_MILLISEC = 1000*60*60;
const SLOT_REVISE_NUMBER = 24*2*4;
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

	getTimeLevel(task, currentTime) {
		let remainTime = ((new Date(task.duedate) - currentTime) / HOUR_MILLISEC).toFixed(1);
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

	reviseTimeSlot(toRealtime, now, slot) {
		if (toRealtime) {
			let diff = slot - ((now + SLOT_REVISE_NUMBER) % SLOT_NUMBER);
			if (diff < 0) diff += SLOT_NUMBER;
			return now + diff;
		}
		else {
			slot = (slot + SLOT_REVISE_NUMBER) % SLOT_NUMBER;
		}
		return slot;
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

	process(userId, originalTimeTables, events, tasks, opt) {
		opt = opt || {};

		console.log('process');

		//methods & properties of this class
		let helper = this.app.helper;
		let getTimeslot = this.getTimeslot;
		let getTimeLevel = this.getTimeLevel;
		let isTaken = this.isTaken;
		let makeNewEvent = this.makeNewEvent;
		let sortByTime = this.sortByTime;
		let sortByTimelevel = this.sortByTimelevel;
		let reviseTimeSlot = this.reviseTimeSlot;

		//temporally used variables in this method.
		let currentTime = opt.time || Date.now();
		console.log('process', {currentTime: new Date(currentTime)});
		let now = getTimeslot(currentTime);
		let slotAllocator = new SlotAllocator(now, SLOT_NUMBER);
		let timetable = [];

		function fillEvents(events){
			_.each(events, event=>{
				let start = getTimeslot(event.start);
				let end = getTimeslot(event.end);

				let allocation = slotAllocator.alloc(start, end, false);
				let conflicted = false;
				if(allocation == 0){
					console.log("########");
					console.log(event);
					console.log('cannot alloc event.');

					conflicted = true;
				}

				let tableEvent = makeNewEvent(userId, undefined, start, end, event.summary, 0);
				tableEvent.conflicted = conflicted;
				timetable.push(tableEvent);
			});
		}

		function preprocessTasks(tasks){
			return Q.all(tasks.map(task=>{
				let p0 = helper.taskHelper.getProcessedTime(task, currentTime);
				
				return Q.spread([p0], (processedtime)=>{
					task.timelevel = getTimeLevel(task, currentTime);
					task.processedtime = processedtime;
					return task;
				})
			}))
		}

		function processTasksByTimeLevel(tasks){
			_.each(tasks, processTaskByTimeLevel);
		}

		function processTaskByTimeLevel(task){
			let level = task.timelevel;
			let slot_begin = now%SLOT_NUMBER;
			let slot_size = SLOT_NUMBER;
			let timespan = Math.max(Math.floor(task.estimation*2 - task.processedtime),0);
			timespan += (task.marginBefore||0) + (task.marginAfter||0);

			let timePreferenceScore = task.timePreferenceScore;
			let slot_due = getTimeslot(task.duedate);
			
			if(slot_due-now < SLOT_NUMBER){
				slot_size = slot_due - now;
			}

			// console.log(task.name, task.adjustable, level, {now, slot_begin, slot_size, timespan});
			// console.log(timePreferenceScore.length);

			if (task.adjustable || (0 <= level && level < (24*7/TIMELEVEL_SIZE))) {
				// Calculate time prefer score for each slot term

				let beginAfter = Math.floor((task.beginAfter || 0)/SLOT_SIZE); 

				let scores = [];
				for (let i = 0; i <= slot_size-(task.adjustable?1:timespan); ++i) {
					let slot = reviseTimeSlot(false, now, now+i);

					let start = slot;
					let _timespan = timespan;

					if(beginAfter>0)
						console.log(task.name, beginAfter);

					if(start < beginAfter){
						continue;
					}

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
					if(a.score != b.score)
						return b.score - a.score;

					if(a.length != b.length)
						return b.length - a.length;

					if(a.start != b.start)
						return a.start - b.start;
					
					if(a.end != b.end)
						return b.end - a.end;

					return 0;
				});

				if(task.name == 'sleep 2'){
					console.log(scores);
				}

				// console.log('maximum score : ', _.max(scores, item=>item.score))
				// console.log('minimum score : ', _.min(scores, item=>item.score))
				
				// Checkout if the task's prefer slot is taken by the other
				for (let i = 0; i < scores.length; i++) {
					let scoreObj = scores[i];
					let start = reviseTimeSlot(true, now, scoreObj.start);
					let end = reviseTimeSlot(true, now, scoreObj.end);
					let score = scoreObj.score;
					let allocation = slotAllocator._alloc(scoreObj.start, scoreObj.end);

					if(allocation>0 || timespan==0){
						let tableTask = makeNewEvent(userId, task._id, start+task.marginBefore||0, end-task.marginAfter||0, task.name, task.estimation);
						if (tableTask) {
							timetable.push(tableTask);
							break;
						}
					}
				}					
			}
		}

		function processAndFilterAlreadyPlayingTask(task){
			let alreadyStarted = task.state==TaskStateType.named.start.id;
			console.log(task.name, task._id, {alreadyStarted});
			console.log(originalTimeTables);

			if(alreadyStarted){
				let query = {taskId: task._id};
				let timeTableEvent = _.filter(originalTimeTables, item=>item.taskId&&item.taskId.toString()===query.taskId.toString())[0];
				if(!timeTableEvent){
					return true;
				}
				
				timetable.push(timeTableEvent);
				return false;
			}
			else{
				return true;
			}
		}

		return preprocessTasks(tasks)
		.then(tasks=>{
			return tasks.sort(sortByTimelevel);
		})
		.then(tasks=>{
			tasks = _.filter(tasks, processAndFilterAlreadyPlayingTask);
			
			//events
			fillEvents(events);
			
			//tasks
			_.chain(tasks)
			.groupBy('timelevel')
			.each(processTasksByTimeLevel);

			return timetable;
		})
		.then(timetable=>timetable.sort(sortByTime));
	}

	make(user, opt) {
		let helper = this.app.helper;
		let userId = user._id;

		let pOriginalTimeTable = helper.timetable.find(userId);
		return pOriginalTimeTable
		.then(originalTimeTables=>_.map(originalTimeTables, item=>item.toObject()))
		.then(originalTimeTables=>{
			console.log('originalTimeTables', originalTimeTables);
			// Now tablemaker remove all timetable for every requests.
			let pReset = helper.timetable.reset(userId);
			let pCal = helper.google.getCalendarEventsWeek(user, opt);
			let pTask = helper.taskHelper.find(userId);
			return Q.spread([pReset, pCal, pTask], (reset, events, tasks)=>{
				return this.process(userId, originalTimeTables, events, tasks, opt);
			})
		})
		.then(list=>helper.timetable.createItems(user._id, list))
		.fail(err=>logger.error(err, err.stack));
	}
}

module.exports = TimeMaker;
