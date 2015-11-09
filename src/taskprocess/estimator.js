'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');

class TimeEstimator{
	constructor(app, opt){
		this.app = app;
		this.opt = opt || {};
		this.opt.defaults = this.opt.defaults||1;
	}

	calculateTakenTime(logs) {
		let takenTime = 0;

		let from = 0;
		var lognum;
		if(!logs) {
			lognum = -1;
		}
		else {
			lognum = logs.length;
		}
		while (from < lognum) {
			if (logs[from].type == 200) {
				let to = from + 1;
				while (to < lognum) {
					if (logs[to].type == 300 || logs[to].type == 500) {
						let timeTo = new Date(logs[to].time);
						let timeFrom = new Date(logs[from].time);
						takenTime += (timeTo - timeFrom);
						from = to;
						break;
					}
					to += 1;
				}
			}
			from += 1;
		}

		takenTime /= (60 * 60 * 1000);

		if (takenTime < 1) return 1;
		if (takenTime > 365*24) return 365*24;
		return takenTime.toFixed(1);
	}

	process(userId, taskName) {
		let calculator = this.calculateTakenTime;
		let helper = this.app.helper;
		let splits = taskName.split(" ");
		let self = this;

		return Q(helper.taskHelper.find(userId))
		.then(function(results){
			if (results.length == 0) return self.opt.defaults;
			return Q.all(results.map(function(task){
				const taskId = task._id.toString();
				return Q(helper.tasklog.find(userId, {taskId}))
				.then(list=>{
					var taskName = task.name;
					var time = calculator(list);
					var result = {
						name: taskName,
						takenTime: time
					};
					return Q.resolve(result);
				})
				.fail(err=>console.log("TIME CALCULATION ERROR:", err));
			}))
			.then(function(results){
				if (!results) return 3;
				let result = 1.0, totalResult = 1.0;
				let count = 0, totalCount = 0;

				_.each(results, log=>{
					++totalCount;
					totalResult *= log.takenTime;
					for (var i = 0; i < splits.length; i++) {
						if(log.name.indexOf(splits[i]) >= 0) {
							++count;
							result *= log.takenTime;
						}
					}
				});

				if (count == 0)
					result = Math.pow(totalResult, (1.0/totalCount)).toFixed(1);
				else
					result = Math.pow(result, (1.0/count)).toFixed(1);
				
				return result;
			})
			.fail(err=>console.log("TIME CALCULATION ERROR:", err));
		})
	}

	estimate(userId, taskName){
		return Q(this.process(userId, taskName));
	}
}

module.exports = TimeEstimator;
