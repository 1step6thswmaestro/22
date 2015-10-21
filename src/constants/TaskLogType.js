var helper = require('./helper');
var TaskState = require('./TaskState');

var Type = [
	{id: 100, name: 'create', nextState: TaskState.named.created.name, tokenize: false}
	, {id: 200, name: 'start', nextState: TaskState.named.started.name}
	, {id: 300, name: 'pause', nextState: TaskState.named.paused.name, tokenize: false}
	, {id: 350, name: 'resume', nextState: TaskState.named.started.name}
	, {id: 400, name: 'postpone', nextState: TaskState.named.paused.name}
	, {id: 500, name: 'complete', nextState: TaskState.named.completed.name}
];

module.exports = helper.processEnum(Type);
