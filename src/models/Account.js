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
		, feedly: {
			access_token: String
			, id: String
			, date: Date
		}
		, thirdparty: {
			google: {
				auth: Schema.Types.Mixed
				, calendars: [Schema.Types.Mixed]
			}
		}

		, timestampLastActivity: {type: Date, default: ""}

		, locationstampHome: {
			longitude: Number,
			latitude: Number,
			required: false
		}
		, locationstampSchool: {
			longitude: Number,
			latitude: Number,
			required: false
		}
		, locationstampWork: {
			longitude: Number,
			latitude: Number,
			required: false
		}
		, locationstampEtc: {
			longitude: Number,
			latitude: Number,
			required: false
		}
		, locAllInfo: String
		, locClusterKey: String
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
