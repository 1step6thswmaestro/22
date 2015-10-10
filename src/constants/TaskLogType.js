var helper = require('./helper');

var Type = [
	{id: 100, command: 'create'}
	, {id: 200, command: 'start'}
	, {id: 300, command: 'pause'}
	, {id: 350, command: 'resume', state: 'start'}
	, {id: 400, command: 'postpone'}
	, {id: 500, command: 'complete'}
];

module.exports = helper.processType(Type);
