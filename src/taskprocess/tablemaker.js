'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');
var SlotAllocator = require('./SlotAllocator');
var TaskStateType = require('../constants/TaskStateType');

const SLOT_SIZE = 1000*60*30;
const HOUR_MILLISEC = 1000*60*60;
const SLOT_NUMBER = 48*7;
const SLOT_REVISE_NUMBER = 24*2*4;
const TIMELEVEL_SIZE = 4; // hours
const CALC_DAY_NUMBER = 5; // days

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

		function calculateIntervalScore(task) {
			let intervalScore = [];
			let loopSize = getTimeslot(task.duedate) - now - task.slotspan;

			let _loop = loopSize;
			while (_loop-- > 0) {
				let score = 0.0;
				let scoreIndex = reviseTimeSlot(false, now, now + _loop);

				for (let i = 0; i <= task.slotspan; i++) {
					score += task.timePreferenceScore[(scoreIndex + i)%SLOT_NUMBER];
				}
				if (score > 0) {
					intervalScore.push({
						from: scoreIndex,
						score: score
					});
				}
			}

			if (intervalScore.length == 0 || !intervalScore) {
				let _loop = Math.min(loopSize, CALC_DAY_NUMBER*48);
				while (_loop-- > 0) {
					let scoreIndex = reviseTimeSlot(false, now, now + _loop);

					if (task.name == 'sleep' || !(0 <= (scoreIndex+18)%48 && (scoreIndex+18)%48 <= 20)) {
						intervalScore.push({
							from: scoreIndex,
							score: 0.0
						});
					}
				}
			}

			intervalScore.sort(function(a, b){
				return b.score-a.score
			});
			return intervalScore;
		}

		function preprocessTasks(tasks){
			return Q.all(tasks.map(task=>{
				let p0 = helper.taskHelper.getProcessedTime(task, currentTime);
				
				return Q.spread([p0], (processedtime)=>{
					task.timelevel = getTimeLevel(task, currentTime);
					task.slotspan = Math.max(Math.floor(task.estimation * 2), 1);
					task.intervalScore = calculateIntervalScore(task);
					//console.log(task.name, task.intervalScore[0].score);
					return task;
				})
			}))
		}

		function processTasksByTimeLevel(tasks){
			allocateTasks(0, 0);
			console.log('table made score with: ', _MAX_SCORE);
		}

		// Global variables for making timetable
		var _TASKS;
		var _MAX_SCORE = -1; // we are going to find this value
		var _TIMETABLE = []; // this var is used during DFS search.

		function allocateTasks(score, indexCurrentTask) {
			// score: score when we processed task up to task[indexCurrentTask-1].
			var _task = _TASKS[indexCurrentTask];
			var intervalScore = _task.intervalScore;

			if (indexCurrentTask == _TASKS.length - 1) {
				// Process the last tasks on the list.
				// Special treatment on DFS terminal node. We don't want to waste stack resource.
				
				let i;
				for (i = 0; i < intervalScore.length; i++) {
					let from = intervalScore[i].from;
					let to = from + _task.slotspan;
					if (slotAllocator.test(from, to) > 0){
						score += intervalScore[i].score;
					    break;
					}
				}

				if (score > _MAX_SCORE) {
					_MAX_SCORE = score;
					let start = reviseTimeSlot(true, now, intervalScore[i].from);
					let _event = makeNewEvent(userId, _task.id, start, start+_task.slotspan, _task.name, 0)
					_TIMETABLE.push(_event);

					timetable = _.map(_TIMETABLE, _.clone);
				}
			}

			// Special treatment on DFS terminal node. We don't want to waste stack resource.
			if (indexCurrentTask == _TASKS.length-1)
				return;

			for (let i = 0; i < intervalScore.length; i++) {
				let _interval = intervalScore[i];

				// if unvisited interval
				let from = _interval.from;
				let to = from + _task.slotspan;
				if (slotAllocator.test(from, to) > 0) {
					// set visit
					slotAllocator._alloc(from, to);

					let start = reviseTimeSlot(true, now, _interval.from);
					let _event = makeNewEvent(userId, _task.id, start, start+_task.slotspan, _task.name, 0)
					_TIMETABLE.push(_event);

					// get maximum score if allocate with this interval
					allocateTasks(score + _interval.score, indexCurrentTask+1);
					_TIMETABLE.pop();
				}
			}
		}

		function processAndFilterPassedOrAlreadyPlayingTask(task){
			let alreadyStarted = task.state==TaskStateType.named.start.id;

			if(alreadyStarted){
				let query = {taskId: task._id};
				let timeTableEvent = _.filter(originalTimeTables, item=>item.taskId&&item.taskId.toString()===query.taskId.toString())[0];
				if(!timeTableEvent){
					return true;
				}
				
				timetable.push(timeTableEvent);
				return false;
			}
			else if (getTimeslot(task.duedate) < now) {
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
			tasks = _.filter(tasks, processAndFilterPassedOrAlreadyPlayingTask);

			//events
			fillEvents(events);
			
			//tasks
			_TASKS = tasks;
			processTasksByTimeLevel(0, 0);

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
