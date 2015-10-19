var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(app){
	var connectionLogSchema = new Schema({
		userId: Schema.Types.ObjectId
		, loc: { type: { type: String }, coordinates: [ ] }
		, time: {type: Date, default: Date.now}
	});
	mongoose.model('ConnectionLog', connectionLogSchema);
};
