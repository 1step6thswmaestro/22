'use strict'

var TokenizerClass = require('../taskprocess/tokenizer');
var TaskLogType = require('../constants/TaskLogType');
var _ = require('underscore');

function TokenBasedPriorityStrategy(app){
	this.app = app;
	this.tokenizer = new TokenizerClass(app);
}

TokenBasedPriorityStrategy.prototype.ready = function(userId, time){
	let self = this;
	this.time = time || Date.now();
	let timeDivision = this.tokenizer.getTimeDivision(this.time);
	let daytime = timeDivision%48;

	console.log('TokenBasedPriorityStrategy', {time:(new Date(this.time)), timeDivision, daytime});

	return this.app.helper.predictToken.find(userId, {
		daytime: {$gte: daytime-2, $lte: daytime+2}
	}, undefined, {sort: {time: 1}})
	.then(function(tokens){
		self.tokenGroups = _.mapObject(_.groupBy(tokens, 'status'), arr=>_.countBy(arr, 'text'));
	})
}

TokenBasedPriorityStrategy.prototype.calculate = function(task){
	let score = 0.0;
	let tokens = this.tokenGroups[TaskLogType.named.start.id];

	_.each(tokens, (count, text)=>{
		if(task.name.search(text)>=0){
			score += count;
		}
	})

	console.log(task.name, score);

	return score;
}

module.exports = TokenBasedPriorityStrategy;