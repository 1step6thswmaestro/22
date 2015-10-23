var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(app){
	var TimeSlotSchema = new Schema({
		userId: Schema.Types.ObjectId,
		slotIndex: {type: Number},
		name: {type: String},
		tokens: [String]
	});

	mongoose.model('TimeSlot', TimeSlotSchema);
};
