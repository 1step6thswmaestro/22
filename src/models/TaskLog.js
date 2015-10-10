var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ActionTypes = require('../constants/TaskLogType');

module.exports = function(app){
	var taskLogSchema = new Schema({
		taskId: Schema.Types.ObjectId
		, userId: Schema.Types.ObjectId
		, type: Number
		, loc: { type: { type: String }, coordinates: [ ] }
		, time: {type: Date, default: Date.now}
	});

	taskLogSchema.index({ taskId: 1 });
	taskLogSchema.index({ userId: 1, loc: '2dsphere' });
	mongoose.model('TaskLog', taskLogSchema);
};
