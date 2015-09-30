var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;
var ObjectId = Types.ObjectId;

var crypto = require('crypto');

module.exports = function(){
	var accountSchema = new Schema({
		name: String
		, email: String
		, hashed_passwd: String
		, salt: String
	});

	accountSchema.methods = {
		encrypt: function(passwd){
			return crypto.createHmac('sha1', this.salt).update(passwd).digest('hex');
		}
		, authenticate: function(passwd){
			return this.encrypt(passwd) === this.hashed_passwd;
		}
	};

	accountSchema
		.virtual('passwd')
		.set(function(passwd){
			this.salt = makeSalt();
			this.hashed_passwd = this.encrypt(passwd);

			function makeSalt(){
				return Math.round(new Date().valueOf() * Math.random()) + '';
			}
		});

	mongoose.model('Account', accountSchema);
}
