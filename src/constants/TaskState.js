var helper = require('./helper');

// Transition Rule for tasks

// created -> paused (when your ponstpone the task) / started / completed
// started -> paused / completed
// paused -> started / completed
// completed -> paused (When user accidently click completed, they may want to revert it)


var TaskState = [
	{id: 100, name: 'created'} // Created but never has been started.
	// TODO: think about if 'created' state is really necessary.
	// It could be replaced with 'paused'.
	, {id: 200, name: 'started'}
	, {id: 300, name: 'paused'}
	, {id: 500, name: 'completed'}
];

module.exports = helper.processEnum(TaskState);
