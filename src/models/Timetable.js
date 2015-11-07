var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(app){
	var timetableSchema = new Schema({
		userId: Schema.Types.ObjectId,
		summary: {type: String},

		tableslotStart: {type: Number},
		tableslotEnd: {type: Number},
	});

	timetableSchema.index({ userId: 1 });
	mongoose.model('Timetable', timetableSchema);
};
