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
			, refresh_token: String
			, id: String
			, expireDate: Date
		}
		, thirdparty: {
			google: {
				auth: Schema.Types.Mixed
				, calendars: [Schema.Types.Mixed]
			}
		}

		, timestampLastActivity: {type: Date, default: ""}

		// A GeoJSON geometry object.
		// http://geojson.org/geojson-spec.html
		// Example data: {type : "Point", coordinates: [100.0, 0.0]}
		, locHome: { type: { type: String }, coordinates: [ ] }
		, locSchool: { type: { type: String }, coordinates: [ ] }
		, locWork: { type: { type: String }, coordinates: [ ] }
		, locEtc: { type: { type: String }, coordinates: [ ] }
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
