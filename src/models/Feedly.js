var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;
var ObjectId = Types.ObjectId;

var crypto = require('crypto');

module.exports = function(){
	// create instance
	var Feedly = new Schema({
		user_email: {type: String, required: true}
		, feedly_id: {type: String, default: "", required: false}
		, feedly_hashed_passwd: {type: String, default: "", required: false}
		, salt: {type: String, default: "", required: false}
		, rss_updated: {type: Number, default: 0, required: false}
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