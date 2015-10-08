var ActionTypes = [
	{id: 100, command: 'create'}
	, {id: 200, command: 'start'}
	, {id: 300, command: 'snooze'}
	, {id: 400, command: 'complete'}
];

function process(types){
	var named = {};
	for(var i in types){
		named[types[i].command] = types[i];
	}

	var indexed = {}
	for(var i in types){
		indexed[types[i].id] = types[i];
	}	

	return {list: types, named: named, indexed:indexed, defaults: types[0]};
}

module.exports = process(ActionTypes);
