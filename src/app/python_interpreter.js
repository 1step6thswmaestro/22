var path			= require('path');
var PythonShell 	= require('python-shell');

// define absolute directory
var py_absolute_path = path.resolve('./src/python_scripts/');

var py_function_broker = function(path, input, callback){
	// This function should get a message. 
	// Then it will return to you the python script result as JSON type
	var options = {
	  mode: 'text',
	  pythonPath: '/usr/bin/python',
	  scriptPath: py_absolute_path ,
	  args: input
	};

	PythonShell.run(morphem_py_path, options, function(err, results){
		if (err) throw err;
		callback(JSON.parse(results[0]))
	});
}

module.exports = {
	analyze_morphem : function(msg, cb) {
		logger.log(morphem_py_path)
		//define function path
		var morphem_py_path = 'morphem_call.py'
		py_function_broker(morphem_py_path, msg, cb);
	}
}
