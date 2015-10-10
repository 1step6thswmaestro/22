var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(app){
	var taskSchema = new Schema({
		userId: Schema.Types.ObjectId,
		name: String,
		description: {type: String, default: ""},
		importance: {type: Number, default: 0},
		priorityScore: {type: Number, default: 0.0},
		estimation: {type: Number, default: 1.0},	//unit-hour
		duedate: {type: Date, default: function(){
			return new Date(Date.now() + 24*60*60*1000);
		}},
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
