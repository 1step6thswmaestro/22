var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(app){
	var taskSchema = new Schema({
		user_id: Schema.Types.ObjectId,
		name: String,
		desc: String,
		importance: Number,
		priority: {type: Number, default: 0.0},
	  offset: {type: Number, default: 0.0, required: false},

		//estimate_time: {type: Date, default: Date.now()},
		timestampCreated: {type: Date, default: Date.now()},
		timestampStart: {type: Date, default: Date.now()},
		timestampComplete: {type: Date, default: Date.now()},
		timestampDuedate: {type: Date, default: Date.now()},

	  expectedDuration: {type: String, default: ""},
		locationstampStart: {
			longitude: Number,
			latitude: Number,
	        required: false
		},
		locationstampComplete: {
			longitude: Number,
			latitude: Number,
	        required: false
		}

	});

	taskSchema.methods ={
		viewTask: function viewTask() {
    	console.log("Task (Prior:", this.priority, ") Name:" + this.name + " Desc:" + this.description + " Importance:" + this.importance + " Due:")
		},
		calcPriority: function calcPriority() {
		  this.priority = 0;
		  var dueDiff;

		  console.log(this.timestampDuedate + "////" + Date.now());

		  if ((this.timestampDuedate) == "None")
		    dueDiff = 30;
		  else
		    dueDiff=Math.floor(Math.abs(this.timestampDuedate-Date.now()) / (1000*60*60*24)); // convert to day diff.


		  console.log(this.importance, dueDiff);

		  this.priority = this.importance - dueDiff + this.offset;
		},
		compare: function compare(a,b) { // Sort by priority, descending
		  if (a.priority > b.priority)
		    return -1;
		  if (a.priority < b.priority)
		    return 1;
		  return 0;
		}
	};

	mongoose.model('Task', taskSchema);
};
