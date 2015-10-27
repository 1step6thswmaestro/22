function processType(types){
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

module.exports = {
	processType
}
