'use strict'

var path = require('path');
var spawn = require("child_process").spawn

// define absolute directory
var py_absolute_path = path.resolve('./src/python_scripts/');

// define function path
var morphem_py_path = 'morphem_call.py'
var getToken_py_path = 'getToken.py'
var getTimePrefScore_py_path = 'getTimePrefScore.py'

var Q = require('q');

var py_function_broker = function(path, input, callback){
	// This function should get a message.
	// Then it will return to you the python script result as JSON type.

	var args = [py_absolute_path + '/' + path].concat(input);
	var result = '';
	// console.log('args for python script:', args);

	var pythonProcess = spawn("python",  args);
	pythonProcess.stdout.on('data', function(data){
		result += data;
	});

	pythonProcess.stdout.on('close', function(code){
		if (code == 0){ // On success
			callback(JSON.parse(result));
		}
		else{
			console.error('stdout closed with code: ' + code);
			callback(null);
		}
	});

	pythonProcess.stderr.on('data', function(data){
		console.error('stderr: ' + data);
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
			var tokens;
			if (result == null){
				tokens = null
			}
			else {
				tokens = result.tokens
			}
			defer.resolve(tokens);
		});
		return defer.promise;
	},
	getTimePrefScore : function(userId, tokens) {
		// userId: userId string. NOT object.
		// tokens: array of strings

		var input = [userId].concat(tokens);
		// console.log(input);
		let defer = Q.defer();
		py_function_broker(getTimePrefScore_py_path, input, function(output){
			// Resolve a Deferred object and call any doneCallbacks with the given args
			var results;
			if (output == null){
				results = {tokens: tokens, score: null};
			}
			else {
				results = {tokens: tokens, score: output.score};
			}
			defer.resolve(results);
		});
		return defer.promise;
	}
}
