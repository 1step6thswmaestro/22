'use strict'

var path			= require('path');
var PythonShell 	= require('python-shell');

// define absolute directory
var py_absolute_path = path.resolve('./src/python_scripts/');

//define function path
var morphem_py_path = 'morphem_call.py'
var getToken_py_path = 'getToken.py'
var getTaskScore_py_path = 'getTaskScore.py'

var Q = require('q');

var py_function_broker = function(path, input, callback){
	// This function should get a message.
	// Then it will return to you the python script result as JSON type
	var options = {
	  mode: 'text',
	  // pythonPath: '/usr/bin/python',
	  scriptPath: py_absolute_path ,
	  args: input // input has form of list. ie. input = ['value1', 'value2', 'value3']
	};


	PythonShell.run(path, options, function(err, results){
		if (err) throw err;
		console.log('python script result:');
		console.log(JSON.parse(results[0]))
		callback(JSON.parse(results[0]))
	});
}

module.exports = {
	analyze_morphem : function(msg) {
		let defer = Q.defer();

		logger.log(morphem_py_path)
		py_function_broker(morphem_py_path, [msg], function(tokens){
			defer.resolve(tokens.result);
		});

		return defer.promise;
	},
	getToken : function(content) {
		var input = [content];
		let defer = Q.defer();
		py_function_broker(getToken_py_path, input, function(result){
			// Resolve a Deferred object and call any doneCallbacks with the given args
			defer.resolve(result.tokens);
		});
		return defer.promise;
	},
	getTaskScore : function(userId, time, task) {
		var input = ['a', 'b', 'c'];
		console.log(input);
		let defer = Q.defer();
		py_function_broker(getTaskScore_py_path, input, function(result){
			// Resolve a Deferred object and call any doneCallbacks with the given args
			defer.resolve(result);
		});
		return defer.promise;
	}
}
