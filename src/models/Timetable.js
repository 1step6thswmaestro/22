var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(app){
	var timetableSchema = new Schema({
		userId: Schema.Types.ObjectId,
		taskId: Schema.Types.ObjectId,
		lastModified: {type: Date, default: Date(Date.now())},
		// 00:00 is index 0, 00:30 is index 1, ..., 23:30 is index 47
		tableslotIndex: {type:Number},
	});

	timetableSchema.index({ userId: 1 });
	mongoose.model('Timetable', timetableSchema);
};
