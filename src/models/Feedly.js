var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;
var ObjectId = Types.ObjectId;

var crypto = require('crypto');

module.exports = function(){
	// create instance
	var Feedly = new Schema({
		user_id: String
		, feedly_id: String
		, feedly_hashed_passwd: String
		, salt: String
		, rss_list: [] 
	});

	//define functions
	Feedly.methods = {
		encrypt: function(passwd){
			return crypto.createHmac('sha1', this.salt).update(passwd).digest('hex');
		}
		, authenticate: function(passwd){
			return this.encrypt(passwd) === this.hashed_passwd;
		}
		, get_user_feedly_info: function(user_id){
			var feedly = new Feedly();
			feedly.findOne({'user_id':user_id},function(err,feedly){
		        if(err){
		            logger.log(err);
		        }
	    	});

	    	return {
	    		feedly_id : feedly.feedly_id
	    		, feedly_hashed_passwd : feedly.feedly_hashed_passwd
	    	};
		}
	};

	// Feedly
	// 	.virtual('passwd')
	// 	.set(function(passwd){
	// 		this.salt = makeSalt();
	// 		this.feedly_hashed_passwd = this.encrypt(passwd);
	// 		function makeSalt(){
	// 			return Math.round(new Date().valueOf() * Math.random()) + '';
	// 		}
	// 	});

	mongoose.model('Feedly', Feedly);
};