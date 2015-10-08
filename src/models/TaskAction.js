var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ActionTypes = require('./TaskActionTypes');

module.exports = function(app){
	var taskActionSchema = new Schema({
		taskId: Schema.Types.ObjectId
		, type: Number
		, loc: { type: { type: String }, coordinates: [ ] }
		, time: {type: Date, default: Date.now}
	});

	taskActionSchema.index({ loc: '2dsphere' });
	mongoose.model('TaskAction', taskActionSchema);
};
