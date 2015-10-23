var path	 = require('path')
var py_interpreter = require(path.resolve('./src/app/python_interpreter'))

module.exports = function(app){
	app.use('/test/morphem', function(req, res) {
		test_msg = '안녕하세요! 좋은 아침입니다';
		logger.log(test_msg);
		logger.log(path.resolve('./src/app/python_interpreter.js'));
		py_interpreter.analyze_morphem(test_msg)
		.then(function(msg) {
			logger.log(msg);
			res.send(JSON.stringify(msg));
		});
	});

	app.use('/test/score', function(req, res) {
		var test_msg = '';
		py_interpreter.getTaskScore(test_msg, 0, 0)
		.then( function(msg) {
			console.log(msg);
			logger.log(msg);
			res.send(JSON.stringify(msg));
		});
	});
};
