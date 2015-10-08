var mongoose = require('mongoose')
var path	 = require('path')
var py_interpreter = require(path.resolve('./src/app/python_interpreter'))
var feedly_connector = require(path.resolve('./src/app/feedly_connector'))
var Futures = require('Futures')


module.exports = function(app){

	var feedly_sample = {
		user_id: "oneminddev"
		, feedly_id: "oneminddev@gmail.com"
		, feedly_hashed_passwd: "pyLecbJmtmrM49"
		, salt: ""
		, rss_list: [] 
	};

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
		var feedly_model = mongoose.model('Feedly')
		
		feedly_inst = new feedly_connector(feedly_sample.user_id);
		
		
		//feedly_inst.test()
	});
};