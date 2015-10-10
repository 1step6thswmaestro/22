var mongoose = require('mongoose');
var Feedly = require('feedly');
var feedly_model = mongoose.model('Feedly');
var path = require('path');
var Futures = require('futures');

function feedly_connector(user_email, callback){
	this.user_email = user_email;
	// this.feedly_user_info = feedly_user_info;
	var sequence = Futures.sequence();
	var recall = this;
	sequence
		.then(function(next){
			recall.load_data(function(msg, doc){
				recall.feedly_user_info = doc
				logger.log(msg);
				logger.log(doc);
				next(recall);
			});
		})
		.then(function(next, recall){
			recall.initialize();
			next(recall);
		})
		.then(function(next){
			logger.log('feedly initialized.........' + recall.feedly_instance)
		})
}

module.exports = feedly_connector;

feedly_connector.prototype.load_data = function(cb){
	var user_email = this.user_email;

	feedly_model.findOne({"user_email" : user_email}, function(err, doc){
		if (err){
			logger.error(err);
			return;
		}

		if (doc){
            cb('User feedly information already exists ... ', doc);
        }else{

        	var user = feedly_model({'user_email' : user_email});
        	logger.log('information : ' + user_email);
        	logger.log('user : ' + user);
            user.save(function(err, doc_){
            	if (err){
            		logger.error(err);
            		return;
            	}
                cb('feedly information save successfully ', doc_);
            });

        }
	})
}

feedly_connector.prototype.load_access_token = function(){
	var token_path = path.resolve('./.feedly_access.json')
	return JSON.parse(require('fs').readFileSync(token_path, "utf8"));
};

feedly_connector.prototype.read_and_update = function(callback){
	var recall = this;
	this.feedly_instance.reads().then(
		function(result){
			var rss = []
			for(var i = 0 ; i < result.feeds.length ; i++){
				rss.push(result.feeds[i].id);
			}
			logger.log(rss)
			recall.update_feeds(rss, callback)
		},
		function(error){
			callback(error);
		}
	);
};

feedly_connector.prototype.update_feeds = function(rss, callback){
	feedly_model.update(
		{'user_email' : this.user_email},
		{ $addToSet : {rss_list : {$each : rss}}}, function(error, num){
			if ( error){
				logger.error(error);
			}
			callback(rss);
		}
	)

}

feedly_connector.prototype.initialize = function(){
	if (this.access_token == null){
		this.access_token = this.load_access_token();
		logger.log('access token : ' + JSON.stringify(this.access_token));
		logger.log('info  ' + this.feedly_access_information);

		this.feedly_instance = new Feedly({
			client_id : this.access_token.client_id
			//수정 필요
			, client_secret : this.access_token.client_secret
			, token : this.access_token.token
			, base : this.access_token.base
			, port : 8080
		});
	}
};