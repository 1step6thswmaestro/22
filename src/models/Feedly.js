var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;
var ObjectId = Types.ObjectId;

module.exports = function(app){
	// create instance
	var Feedly = new Schema({
		user_id: {type: Schema.Types.ObjectId}
		, status: {type: Number, default: 0}
		, rss_list: [] 
	});

	mongoose.model('feedly_model', Feedly);
};