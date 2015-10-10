var mongoose = require('mongoose')
var path	 = require('path')
var py_interpreter = require(path.resolve('./src/app/python_interpreter'))
var feedly_connector = require(path.resolve('./src/app/feedly_connector'))
var feedly_model = mongoose.model('Feedly')
var Futures = require('Futures')

module.exports = function(app){

	app.use('/test/morphem', function(req, res) {
		test_msg = '안녕하세요! 좋은 아침입니다';
		logger.log(test_msg);
		logger.log(path.resolve('./src/app/python_interpreter.js'));
		py_interpreter.analyze_morphem(test_msg, function(msg) {
			logger.log(msg);
			res.send(JSON.stringify(msg));
		});
	});

	app.use('/test/feedly', function(req, res, next){
		//create feedly info
		var sequence = Futures.sequence();
		sequence
		.then(function(next){
			var user_email = "cij1230@naver.com"
			var feedly_inst = new feedly_connector(user_email, null);
			setTimeout(function(){
				next(feedly_inst)
			}, 1000);
		})
		.then(function(next, feedly_inst){
			feedly_inst.read_and_update(function(msg){
				logger.log(msg);
				res.send(msg);
			});
		})
	});
};