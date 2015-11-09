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
		if(typeof time == 'date'){
			time = time.getTime();
		}

		return Math.floor(time / (30 * 60 * 1000));
	}

	getWeekDayFromToken(time){
		return (new Date(time * (30 * 60 * 1000))).getDay();
	}

	makeTokens(task, log, time, force){
		// Create PredictToken object. It is only function that create this model.
		let self = this;

		if(!force && TaskStateType.indexed[log.type].tokenize === false){
			return;
		}

		return this.tokenizeText(task.name)
		.then(textTokens=>{
			let tokens = _.map(textTokens, text => {
				let NUM_TIMESLOT = 48;
				let weekdayIndex = self.getWeekDayFromToken(time);
				let daytime = time%NUM_TIMESLOT; // (9*2) term offset UTC for Asia/Seoul TimeZone
				let obj = {
					userId: task.userId,
					taskId: task._id,
					text: text,
					duration: task.duedate - task.created,
					priority: task.priority,
					weekday: weekdayIndex,
					time: time,
					daytime: daytime,
					timeslotIndex: weekdayIndex*NUM_TIMESLOT+daytime,
					prevType: task.state,
					type: log.type,
					loc: log.loc,
				};

				return obj;
			});

			return Q.all(_.map(tokens, function(tokenRaw){
				return self.app.helper.predictToken.create(tokenRaw);
			}));
		})
	}

	processTaskById(user, taskId){
		let self = this;

		return app.helper.taskHelper.find(user._id, {_id: taskId})
		.then(function(tasks){
			var task = tasks[0];
			if(task){
				return self.processTask(req.user, task);
			}
		})
		.fail(err=>logger.error(err, err.stack));
	}

	processTask(user, task){
		let self = this;
		let app = this.app;

		let currentTime = new Date(Date.now());
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
				_.each(_.range(self.getTimeDivision(_time), self.getTimeDivision(log.time), -1), time=>{
					//TODO
					//need to ignore mistaken action
					// console.log('p0', task, log, time);
					promises.push(self.makeTokens(task, log, time));
				});

				_time = log.time;
			});
			//create token
			if(lastlog){
				// console.log('===p1===');
				// console.log({created: task.created, lastProcessed: task.lastProcessed});
				if(task.created.getTime() == task.lastProcessed.getTime()){
					// console.log(task, lastlog, self.getTimeDivision(lastlog.time));
					promises.push(self.makeTokens(task, lastlog, self.getTimeDivision(lastlog.time), true));
				}
			}

			if(lastlog){
				// console.log('===p2===');
				// console.log(lastlog);
				// console.log({_time});
				// console.log(_.range(self.getTimeDivision(_time), self.getTimeDivision(lastTime), -1));
				_.each(_.range(self.getTimeDivision(_time), self.getTimeDivision(lastTime), -1), time=>{
					//TODO
					//need to ignore mistaken action
					promises.push(self.makeTokens(task, lastlog, time));
				});
			}

			return Q.all(promises);
		})
		.then(function(){
			return app.helper.taskHelper.update(user._id, {_id: task._id}, {lastProcessed: currentTime})
		})
		.fail(logger.error)
	}

	resetTaskById(user, taskId){
		let self = this;
		let app = this.app;

		return app.helper.taskHelper.find(user._id, {_id: taskId})
		.then(function(tasks){
			var task = tasks[0];
			if(task){
				return self.resetTask(user, task);
			}
		})
		.fail(err=>logger.error(err, err.stack));
	}

	resetTask(user, task){
		let self = this;
		let app = this.app;

		let p0 = app.helper.predictToken.remove(user._id, {taskId: task._id});
		let p1 = app.helper.taskHelper.findOneAndUpdate(user._id, {_id: task._id}, {lastProcessed: task.created});

		return Q.spread([p0, p1], function(result0, task){
			task.lastProcessed = task.created;
			self.processTask(user, task);
		})
	}
}

module.exports = Tokenizer;
