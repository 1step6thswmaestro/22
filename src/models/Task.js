var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(app){
	var taskSchema = new Schema({
		user_id: Schema.Types.ObjectId,
		name: String,
		description: {type: String, default: ""},
		importance: {type: Number, default: 0},
		priority: {type: Number, default: 0.0},
		offset:   {type: Number, default: 0.0, required: false},

		timestampCreated:  {type: Date, default: Date.now.valueOf()},
		timestampStart:    {type: Date, default: ""},
		timestampComplete: {type: Date, default: ""},
		timestampDuedate:  {type: Date, default: ""},

		expectedDuration: {type: String, default: ""},

		// Save related location as 4 bits. (home, school, work, etc)
		// 0 means, no location is related to this task
		// 1 means etc.
		// 8 means home
		// 12 means home and school.
		// and, so on ...
		relatedLocation: {type: Number, default: 0},

		locationstampCreated: {
			address: String,
			longitude: Number,
			latitude: Number,
			required: false
		},
		locationstampStart: {
			address: String,
			longitude: Number,
			latitude: Number,
			required: false
		},
		locationstampComplete: {
			address: String,
			longitude: Number,
			latitude: Number,
			required: false
		},

		taskOnProcess: {type: Boolean, default: false},

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
