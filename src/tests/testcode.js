'use strict'

let Q = require('q');
let _ = require('underscore');
var TimeEstimator = require('../taskprocess/estimator');

module.exports = function(app){
	let timeEstimator = new TimeEstimator(app, {defaults: 1});

	app.tests = [];


	function fillEstimation(){
		return app.helper.taskHelper.findAll({estimation: {$exists: false}})
		.then(tasks=>{
			console.log('not estimated tasks num : ', tasks.length);

			return Q.all(_.map(tasks, task=>{
				return timeEstimator.estimate(task.userId, task.name)
				.then(estimation=>{
					return app.helper.taskHelper.update(task.userId, {_id: task._id}, {estimation});
				})
			}))
			.then(function(results){
				console.log(`total ${results.length} tasks are estimated.`);
			})
		})
		.fail(err=>logger.error(err, err.stack))
	}

	app.tests.push(fillEstimation);
}

