var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(app){
	var eventSchema = new Schema({
		id: String,
		userId: Schema.Types.ObjectId,
		summary: String,
		created: Date,
		start: Date,
		end: Date,
		fullday: Boolean,
		calendarId: String
	});

	eventSchema.index({ id: 1 }, { unique: true });
	eventSchema.index({ start: 1 });

	mongoose.model('Event', eventSchema);
};
