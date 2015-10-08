var mongoose = require('mongoose');
var Feedly = require('feedly');
var feedly_model = mongoose.model('Feedly');
var path = require('path');
var Futures = require('futures');

function feedly_connector(user_id){
	this.user_id = user_id;
	var sequence = Futures.sequence();
	var recall = this;
	sequence
		.then(function(next){
			feedly_model.findOne({'user_id': recall.user_id }, function(err, doc){
				if (err) {
					logger.log(err);
					throw err
				}
				logger.log('User_id : '+recall.user_id);
				logger.log('DOC : '+ doc);
	    		recall.feedly_access_information = JSON.parse(JSON.stringify(doc));
	    		logger.log('What : ' +recall.feedly_access_information);
	    		next(recall);
			})
		})
		.then(function(next, recall){
			logger.log('1');
			recall.initialize();
			next(recall);
		})
		.then(function(next, recall){
			logger.log('2');
			recall.test();
			next(recall);
		})
		.then(function(next){
			setTimeout(function(){
				logger.log('feedly initialized.........' + recall.feedly_instance)
			}, 3000);
		})
}

module.exports = feedly_connector;

feedly_connector.prototype.load_access_token = function(){
	var token_path = path.resolve('./.feedly_access.json')
	return JSON.parse(require('fs').readFileSync(token_path, "utf8"));
};

feedly_connector.prototype.test = function(){
	this.feedly_instance.preferences(function(results){
		
        	logger.log("call : " + results);
		},
		function(error){
			logger.log(error);
		}
	)

};

feedly_connector.prototype.initialize = function(){
	if (this.access_token == null){
		this.access_token = this.load_access_token();

		logger.log('info ; ' + this.feedly_access_information);
		logger.log('id : ' + this.user_id);

		logger.log('?? : ' + this.feedly_access_information.feedly_id)

		this.feedly_instance = new Feedly({
			client_id : this.access_token.access_id
			//수정 필요
			, client_secret : this.access_token.access_passwd
			, token : this.access_token.access_token
			, base : this.access_token.base
			, port : 8080
		});
	}
};



