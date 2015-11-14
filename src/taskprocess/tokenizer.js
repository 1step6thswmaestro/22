'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TaskStateType = require('../constants/TaskStateType');
var PredictToken = require('../models/PredictToken');
var Q = require('q');
var py_interpreter = require('../app/python_interpreter');

class Tokenizer{
	constructor(app){
		this.app = app;
	}

	tokenizeText(text){
		// var tokens = text.split(' '); // Very simple tokenizer.
		var tokens = py_interpreter.getToken(text); // Get nouns and verbs
		return Q(tokens);
		// return Q(grab(tokens));

		function grab(tokens){
			// grab() generate every combination of skip-gram.
			let head = tokens[0];
			if(tokens.length<=1){
				return ['', head];
			}
			var _tokens = grab(tokens.slice(1, tokens.length));

			return _.flatten(_.map(_tokens, token=>[head+' '+token, token]));
		}
	}

	getTimeDivision(time){
		// Return current time as timelsot Index from the beginning of the time.
		if(typeof time == 'date'){
			time = time.getTime();
		}

		return Math.floor(time / (30 * 60 * 1000));
	}

	getWeekDayFromToken(time){
		return (new Date(time * (30 * 60 * 1000))).getDay();
	}

	makeTokens(task, log, time, useWeekday, useDaytime, force){
		// Create PredictToken object. It is only function that create this model.
		let self = this;

		if(!force && TaskStateType.indexed[log.type].tokenize === false){
			return;
		}
		var NUM_TIMESLOT = 48;
		var weekdayIndex = self.getWeekDayFromToken(time);
		var daytime = time%NUM_TIMESLOT; // (9*2) term offset UTC for Asia/Seoul TimeZone
		var timeslotIndex = weekdayIndex*NUM_TIMESLOT+daytime;
		if (useWeekday==false){
			weekdayIndex = -1;
		}
		if (useDaytime==false){
			daytime = -1;
		}

		// Improvement Note: Instead of tokenizing for every timeslot,
		// to tokenizing before calling this function, and just use the results.
		// It will increase performance drastically.
		return this.tokenizeText(task.name)
		.then(textTokens=>{
			let tokens = _.map(textTokens, text => {
				console.log('weekday:', weekdayIndex, 'daytime:', daytime);
				let obj = {
					userId: task.userId,
					taskId: task._id,
					text: text,
					duration: task.duedate - task.created,
					priority: task.priority,
					weekday: weekdayIndex,
					time: time,
					daytime: daytime,
					timeslotIndex: timeslotIndex,
					prevType: task.state,
					type: log.type,
					loc: log.loc,
				};
				console.log(obj);

				return obj;
			});

			return Q.all(_.map(tokens, function(tokenRaw){
				return self.app.helper.predictToken.create(tokenRaw);
			}));
		})
	}

	processTaskById(userId, taskId){
		let self = this;

		return app.helper.taskHelper.find(userId, {_id: taskId})
		.then(function(tasks){
			var task = tasks[0];
			if(task){
				return self.processTask(userId, task);
			}
		})
		.fail(err=>logger.error(err, err.stack));
	}

	processTask(userId, task, time){
		let self = this;
		let app = this.app;

		let currentTime = new Date(time || Date.now());
		let _time = currentTime;
		let lastTime = new Date(task.lastProcessed);

		// console.log({lastTime});

		let p0 = this.app.helper.tasklog.find(task.userId, {taskId: task._id, time: {$gt: lastTime}}, undefined, {sort: {time: -1}});
		let p1 = this.app.helper.tasklog.find(task.userId, {taskId: task._id, time: {$lte: lastTime}}, undefined, {sort: {type: -1}, limit: 1});
		// let p2 = this.app.helper.predictToken.find(task.userId, {taskId: task._id}, undefined, {sort: {time: 1}, limit: 1});

		return Q.spread([p0, p1], function(logs, lastlog){
			// console.log({logs, lastlog});
			lastlog = lastlog[0];
			var promises = [];
			_.each(logs, (log) => {
				// console.log(log);
				// console.log({_time, 'log.time': log.time});
				// console.log('p0', self.getTimeDivision(_time), self.getTimeDivision(log.time), _.range(self.getTimeDivision(_time), self.getTimeDivision(log.time), -1));

				// Put token for weekday
				var lastUsedWeekday;
				if(self.getTimeDivision(_time) != self.getTimeDivision(log.time)){
					lastUsedWeekday = self.getWeekDayFromToken(self.getTimeDivision(_time));
					promises.push(self.makeTokens(task, log, self.getTimeDivision(_time), true, false));
				}

				// Loop over time range since start of the task to pasue/complete of the task.
				for(let time = self.getTimeDivision(_time); time>self.getTimeDivision(log.time); time--){
					//TODO
					//need to ignore mistaken action
					// console.log('p0', task, log, time);
					// Put token for daytime.
					promises.push(self.makeTokens(task, log, time, false, true));

					let thisWeekday = self.getWeekDayFromToken(time);
					if (lastUsedWeekday != thisWeekday){
						lastUsedWeekday = thisWeekday;
						promises.push(self.makeTokens(task, log, time, true, false));
					}
				}
				_time = log.time;
			});
			//create token
			if(lastlog){
				// console.log('===p1===');
				// console.log({created: task.created, lastProcessed: task.lastProcessed});
				if(task.created.getTime() == task.lastProcessed.getTime()){
					// In this case, force tokenzing.

					// console.log(task, lastlog, self.getTimeDivision(lastlog.time));

					// Put token for daytime.
					promises.push(self.makeTokens(task, lastlog, self.getTimeDivision(lastlog.time), false, true, true));
					// Put token for weekday
					promises.push(self.makeTokens(task, lastlog, self.getTimeDivision(lastlog.time), true, false, true));
				}
			}

			if(lastlog){
				// console.log('===p2===');
				// console.log(lastlog);
				// console.log({_time});
				// console.log(_.range(self.getTimeDivision(_time), self.getTimeDivision(lastTime), -1));
				var lastUsedWeekday;
				if(self.getTimeDivision(_time) != self.getTimeDivision(lastTime)){
					// Put token for weekday
					lastUsedWeekday = self.getWeekDayFromToken(self.getTimeDivision(_time));
					promises.push(self.makeTokens(task, lastlog, self.getTimeDivision(_time), true, false));
				}

				// Loop over time range since start of the task to pasue/complete of the task.
				for(let time = self.getTimeDivision(_time); time>self.getTimeDivision(lastTime); time--){
					//TODO
					//need to ignore mistaken action

					// Put token for daytime.
					promises.push(self.makeTokens(task, lastlog, time, false, true));

					let thisWeekday = self.getWeekDayFromToken(time);
					if (lastUsedWeekday != thisWeekday){
						lastUsedWeekday = thisWeekday;
						promises.push(self.makeTokens(task, lastlog, time, true, false));
					}
				}
			}

			return Q.all(promises);
		})
		.then(function(){
			return app.helper.taskHelper.update(userId, {_id: task._id}, {lastProcessed: currentTime})
		})
		.fail(logger.error)
	}

	resetTaskById(userId, taskId){
		let self = this;
		let app = this.app;

		return app.helper.taskHelper.find(userId, {_id: taskId})
		.then(function(tasks){
			var task = tasks[0];
			if(task){
				return self.resetTask(userId, task);
			}
		})
		.fail(err=>logger.error(err, err.stack));
	}

	resetTask(userId, task){
		let self = this;
		let app = this.app;

		let p0 = app.helper.predictToken.remove(userId, {taskId: task._id});
		let p1 = app.helper.taskHelper.findOneAndUpdate(userId, {_id: task._id}, {lastProcessed: task.created});

		return Q.spread([p0, p1], function(result0, task){
			task.lastProcessed = task.created;
			self.processTask(userId, task);
		})
	}
}

module.exports = Tokenizer;
