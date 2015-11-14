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
			let slot_due;
			if (!task.duedate) {
				slot_due = SLOT_NUMBER / 7 * 3;
			}
			slot_due = getTimeslot(task.duedate) - now;
			
			for (let i = 0; i < slot_due; i++) {
				let score = 0.0;
				let slot_num = (now + i + SLOT_REVISE_NUMBER)%SLOT_NUMBER;
				for (let j = 0; j <= task.slotspan; j++) {
					score += task.timePreferenceScore[slot_num + j];
				}
				if (score > 0) {
					intervalScore.push({
						from: slot_num,
						score: score
					});
				}
			}

			intervalScore.sort(function(a, b){return b.score-a.score});
			return intervalScore;
		}

		function preprocessTasks(tasks){
			return Q.all(tasks.map(task=>{
				let p0 = helper.taskHelper.getProcessedTime(task, currentTime);
				
				return Q.spread([p0], (processedtime)=>{
					task.timelevel = getTimeLevel(task, currentTime);
					task.slotspan = Math.max(Math.floor(task.estimation * 2 - processedtime),0);
					task.intervalScore = calculateIntervalScore(task);
					//console.log(task.name, task.intervalScore[0].score);
					return task;
				})
			}))
		}

		function processTasksByTimeLevel(tasks){
			allocateTasks(0, 0);
		}

		// Global variables for making timetable
		var VISIT;
		var _TASKS;
		var _MAX_SCORE; // we are going to find this value
		var _TIMETABLE; // this var is used during DFS search.

		function isVisited(from, span) {
			for (let i = 0; i < span; i++){
				if (GLOBAL_VISIT[(from + i)%SLOT_NUMBER]) return true;
			}
			return false;
		}

		function setVisit(from, span) {
			for (let i = 0; i < span; i++){
				GLOBAL_VISIT[(from + i)%SLOT_NUMBER] = true;
			}
		}

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
					let start = now + ((intervalScore[i].from + SLOT_REVISE_NUMBER) % SLOT_NUMBER);
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

					let start = now + ((_interval.from + SLOT_REVISE_NUMBER) % SLOT_NUMBER);
					let _event = makeNewEvent(userId, _task.id, start, start+_task.slotspan, _task.name, 0)
					_TIMETABLE.push(_event);

					// get maximum score if allocate with this interval
					allocateTasks(score + _interval.score, indexCurrentTask+1);
					_TIMETABLE.pop();
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
			
			VISIT = [];
			let loop = SLOT_NUMBER;
			while (loop--) VISIT.push(false);

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
