var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(app){
	var predictTokenSchema = new Schema({
		userId: Schema.Types.ObjectId,
		taskId: Schema.Types.ObjectId,
		text: {type: String},
		duration: {type: Date},
		date: {type: Date},
		priority: {type: Number, default: 1.0},	//0.0~2.0
		weekday: {type: Number},				//0~6 (sun~sat)
		time: {type: Number},					//30분 단위의 유닛 사용
		daytime: {type:Number},                 //30분 단위의 유닛 사용, 하루는 총 0~47의 값을 갖음.
		timeslotIndex: {type:Number}, // Sunday 00:00 is index 0,
		                              // Monday 00:00 is index 48, ...
		                              // Saturday 23:30 is index (48 * 7 - 1)
		prevType: {type: Number},
		type: {type: Number},
		// Example data: {type : "Point", coordinates: [lon, lat]}
		loc: {type: { type: String }, coordinates: [ ]},
		loc_cluster: {type: Number},
	});

	predictTokenSchema.index({ userId: 1, loc: '2dsphere' });
	mongoose.model('PredictToken', predictTokenSchema);
};
