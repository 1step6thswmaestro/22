var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(app){
	var timetableSchema = new Schema({
		userId: Schema.Types.ObjectId,
		taskId: Schema.Types.ObjectId,
		summary: {type: String},

		tableslotStart: {type: Number},
		tableslotEnd: {type: Number},

		estimation: {type: Number},
		dismissed: {type: Boolean, defaults: false}
	});

	timetableSchema.index({ userId: 1 });
	mongoose.model('Timetable', timetableSchema);
};
