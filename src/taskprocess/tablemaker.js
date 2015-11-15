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

	makeNewEvent(userId, taskId, _start, _end, _summary, _estimation, score) {
		let newVal = {
			userId,
			taskId,
			tableslotStart: _start, 
			tableslotEnd: _end,
			summary: _summary,
			estimation: _estimation,
			score
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
			let loopSize = getTimeslot(task.duedate) - now - (task.adjustable?task.slotspan/2:task.slotspan);

			// console.log(task.name, {loopSize});

			let _loop = loopSize;
			while (_loop-- > 0) {
				let score = 0.0;
				let length = task.adjustable?Math.min(loopSize-_loop, task.slotspan):task.slotspan;
				let scoreIndex = reviseTimeSlot(false, now, now + _loop);

				for (let i = 0; i <= length; i++) {
					score += task.timePreferenceScore[(scoreIndex + i)%SLOT_NUMBER] || 0;
				}

				intervalScore.push({
					from: scoreIndex
					, to: scoreIndex + length
					, score: score
					, length: length
				});
			}

			if(!intervalScore.length){
				console.log(task.name, 'not allocated!');
			}

			if(task.name == 'sleep')
				console.log(intervalScore);

			intervalScore.sort(function(a, b){
				if(a.score != b.score)
					return b.score-a.score;

				if(a.length != b.length)
					return b.length-a.score;

				if(a.from != b.from)
					return a.from-b.from;
				
				if(a.to != b.to)
					return b.to-a.to;

				return 0;
			});

			if(task.name == 'sleep')
				console.log(intervalScore);

			return intervalScore;
		}

		function preprocessTasks(tasks){
			return Q.all(tasks.map(task=>{
				let p0 = helper.taskHelper.getProcessedTime(task, currentTime);
				
				return Q.spread([p0], (processedtime)=>{
					task.timelevel = getTimeLevel(task, currentTime);
					task.slotspan = Math.max(Math.floor(task.estimation * 2), 1);
					task.intervalScore = calculateIntervalScore(task);
					task.processedtime = Math.min(processedtime/HOUR_MILLISEC, 365*24);
					
					//console.log(task.name, task.intervalScore[0].score);
					return task;
				})
			}))
		}

		function processTasksByTimeLevel(tasks){
			allocateTasks(slotAllocator, 0, 0);
			console.log('table made score with: ', _MAX_SCORE);
		}

		// Global variables for making timetable
		var _TASKS;
		var _MAX_SCORE = -1; // we are going to find this value
		var _TIMETABLE = []; // this var is used during DFS search.

		function allocateTasks(allocator, score, indexCurrentTask) {
			// score: score when we processed task up to task[indexCurrentTask-1].
			var _task = _TASKS[indexCurrentTask];
			var intervalScore = _task.intervalScore;

			// console.log(_task.name, intervalScore);

			if (indexCurrentTask == _TASKS.length - 1) {
				// Process the last tasks on the list.
				// Special treatment on DFS terminal node. We don't want to waste stack resource.
				
				let i;
				let allocation = 0;
				for (i = 0; i < intervalScore.length; i++) {
					let from = intervalScore[i].from;
					let to = intervalScore[i].to;

					// console.log(_task.name, from, to);
					allocation = allocator.test(from, to, _task.adjustable)
					if (allocation > 0){
						// console.log({from, to}, 'allocated.');
						score += intervalScore[i].score;
					    break;
					}
				}

				// console.log(_task.name, {i, intervalScore: intervalScore.length, score, _MAX_SCORE}, intervalScore[i]);

				if (score > _MAX_SCORE) {
					_MAX_SCORE = score;
					let start = reviseTimeSlot(true, now, intervalScore[i].from);
					let _event = makeNewEvent(userId, _task.id, start, start+allocation, _task.name, 0, score)
					_TIMETABLE.push(_event);

					console.log('## MAX_SCORE ##', {score});
					console.log(_.map(_TIMETABLE, item=>_.pick(item, 'summary', 'score')));

					timetable = _.map(_TIMETABLE, _.clone);
					slotAllocator = allocator;
				}
			}
			else{
				for (let i = 0; i < intervalScore.length; i++) {
					let _interval = intervalScore[i];

					// if unvisited interval
					let from = _interval.from;
					let to = _interval.to;
					let allocation = allocator.test(from, to, _task.adjustable);
					if (allocation > 0) {
						// set visit
						allocator._alloc(from, from+allocation);

						let start = reviseTimeSlot(true, now, _interval.from);
						let end = reviseTimeSlot(true, now, _interval.from+allocation);
						let _event = makeNewEvent(userId, _task.id, start, end, _task.name, 0, _interval.score);
						_TIMETABLE.push(_event);

						console.log(`## ${indexCurrentTask} ##`);
						console.log(i);
						console.log(_.map(_TIMETABLE, item=>_.pick(item, 'summary', 'score')));
						// get maximum score if allocate with this interval
						allocateTasks(allocator.clone(), score + _interval.score, indexCurrentTask+1);
						let popped = _TIMETABLE.pop();
					}
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
			// console.log('originalTimeTables', originalTimeTables);
			// Now tablemaker remove all timetable for every requests.
			let pReset = helper.timetable.reset(userId);
			let pCal = helper.google.getCalendarEventsWeek(user, opt);
			let pTask = helper.taskHelper.find(userId, {state : {$lt: 500}});
			return Q.spread([pReset, pCal, pTask], (reset, events, tasks)=>{
				return this.process(userId, originalTimeTables, events, tasks, opt);
			})
		})
		.then(list=>helper.timetable.createItems(user._id, list))
		.fail(err=>logger.error(err, err.stack));
	}
}

module.exports = TimeMaker;
