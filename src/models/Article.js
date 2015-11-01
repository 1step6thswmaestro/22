var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(app){
	var articleSchema = new Schema({
		userId: Schema.Types.ObjectId,
		originId: String,
		title: String,
		content: String
	});

	articleSchema.index({ userId: 1, originId: 1 }, {unique: true});

	mongoose.model('Article', articleSchema);
};
