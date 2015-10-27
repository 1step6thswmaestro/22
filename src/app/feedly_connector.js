var mongoose = require('mongoose');
var Feedly = require('feedly');
var feedly_model = mongoose.model('feedly_model');
var path = require('path');
var Futures = require('futures');

function feedly_connector(user_id){
	var sequence = Futures.sequence();
	var user_id = user_id;

	var obj = this;

	sequence
	.then(function(next){
		obj.load_data(function(doc){
			obj.feedly_user_info = doc;
			next(obj);
		});
	})
	.then(function(next, obj){
		obj.initialize();
		next(obj);
	})
	.then(function(next){
		logger.log('feedly initialized on : ' + user_id);
	});
}

//--------------------Wrapper Function-----------------------

function feedly_wrapper(){}

feedly_wrapper.prototype.get_or_create_status = function(user_id, callback){
	feedly_model.findOne({"user_id" : user_id}, function(err, doc){
		if (err){
			logger.error(err);
			callback(err, "{ 'message' : 'db error'}");
		}
		if (doc){
            callback(err, doc['status']);
        }else{
        	var user = feedly_model({'user_id' : user_id});
            user.save(function(err, doc_){
            	if (err){
            		logger.error(err);
            	}
                callback(err, doc_['status']);
            });
        }
	});
}

feedly_wrapper.prototype.logon = function(user_id, callback){
	var sequence = Futures.sequence();
	this.get_or_create_status(user_id, function(err, status){
		if (err) {
			callback(err, -1);
		}
		if (status == 1) {
			sequence
			.then(function(next){
				var feedly_inst = new feedly_connector(user_id);
				setTimeout(function(){
					next(feedly_inst)
				}, 1000);
			})
			.then(function(next, feedly_inst){
				feedly_inst.read_and_update(function(err, msg){
					callback(err, status);
				});
			});
		}
	})
}

feedly_wrapper.prototype.change_status = function(user_id, callback){
	var sequence = Futures.sequence();
	sequence
	.then(function(next){
		var feedly_inst = new feedly_connector(user_id);
		setTimeout(function(){
			next(feedly_inst);
		}, 1000);
	})
	.then(function(next, feedly_inst){
		feedly_inst.change(user_id, function(err, status){
			if (err) {
				callback(err, -1);
			}
			next(feedly_inst, status);
		})
	})
	.then(function(next, feedly_inst, status){
		if (status == 0) {
			feedly_inst.logout(function(err, msg){
				callback(err, status);
			})
		} else {
			feedly_inst.read_and_update(function(err, msg){
				callback(err, status);
			});
		}
	})
}

module.exports = feedly_wrapper;

//-----------------------feedly connector's functions------------------------

feedly_connector.prototype.change = function(user_id, callback){
	feedly_model.findOne({"user_id" : user_id}, function(err, doc){
		if (err){
			logger.error(err);
			callback(err, undefined);
		}
		
		var update_status = ~ doc['status'] + 2; // 0 to 1, 1 to 0
        feedly_model.update(
        	{'user_id' : user_id}
        	, { $set : {'status' : update_status}}
        	, function(error, num){
        		if (error){
        			logger.error(error);
        		}
        		callback(error, update_status);
        	}
        );
	});
}

feedly_connector.prototype.read_and_update = function(callback){
	var recall = this;
	this.feedly_instance.reads().then(
		function(result){
			var rss = []
			for(var i = 0 ; i < result.feeds.length ; i++){
				rss.push(result.feeds[i].id);
			}
			recall.update_feeds(rss, function(err, num){
				callback(err, num);
			});
		},
		function(error){
			callback(error, undefined);
		}
	);
};

feedly_connector.prototype.logout = function(callback){
	this.feedly_instance.logout().then(
		function(result){
			callback(undefined, result);
		},
		function(error){
			callback(error, undefined);
		}
	)
}

feedly_connector.prototype.load_data = function(callback){
	var user_id = this.user_id;

	feedly_model.findOne({"user_id" : user_id}, function(err, doc){
		if (err){
			logger.error(err);
			callback(err, "{ 'message' : 'db error'}");
			return;
		}

		if (doc){
            callback(err, doc);
        }else{
        	var user = feedly_model({'user_id' : user_id});
            user.save(function(err, doc_){
                callback(err, doc_);
            });
        }
	})
}

feedly_connector.prototype.load_access_token = function(){
	var token_path = path.resolve('./.feedly_access.json')
	return JSON.parse(require('fs').readFileSync(token_path, "utf8"));
};

feedly_connector.prototype.update_feeds = function(rss, callback){
	feedly_model.update(
		{'user_id' : this.user_id},
		{ $addToSet : {rss_list : {$each : rss}}}, function(error, num){
			if ( error){
				logger.error(error);
			}
			callback(error, num);
		}
	)
}

feedly_connector.prototype.initialize = function(){
	if (this.access_token == null){
		this.access_token = this.load_access_token();

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