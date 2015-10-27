var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TaskLogType = require('../constants/TaskLogType');

module.exports = function(app){
	var taskSchema = new Schema({
		userId: Schema.Types.ObjectId,
		name: String,
		description: {type: String, default: ""},
		importance: {type: Number, default: 0},
		priorityScore: {type: Number, default: 1.0},
		timePreferenceScore: [], // array of (timslotIdx, score) tuples.
		estimation: {type: Number, default: 1.0},	//unit-hour
		duedate: {type: Date, default: function(){
			return new Date(Date.now() + 24*60*60*1000);
		}},		
		expectedDuration: {type: String, default: ""},
		state: {type: Number, default: TaskLogType.named.create.id},

		// Save related location as 4 bits. (home, school, work, etc)
		// 0 means, no location is related to this task
		// 1 means etc.
		// 8 means home
		// 12 means home and school.
		// and, so on ...
		relatedLocation: {type: Number, default: 0},
		lastProcessed: {type: Date, default: Date.now},
		created: {type: Date, default: Date.now}
	});

	taskSchema.index({
		userId: 1
		, priorityScore: -1
	})

	taskSchema.index({
		userId: 1
		, created: 1
	})

	mongoose.model('Task', taskSchema);
};
