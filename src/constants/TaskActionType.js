var helper = require('./helper');

var ActionType = [
	{id: 100, command: 'create'}
	, {id: 200, command: 'start'}
	, {id: 300, command: 'postpone'}
	, {id: 400, command: 'complete'}
];

module.exports = helper.processType(ActionType);
