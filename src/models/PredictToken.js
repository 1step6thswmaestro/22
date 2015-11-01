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
		time: {type: Number},					//30분 단위의 유닛 사용, 하루는 총 0~47의 값을 갖음.
		daytime: {type: Number},
		type: {type: Number},
		loc: {type: { type: String }, coordinates: [ ]},
		loc_cluster: {type: Number},
	});

	predictTokenSchema.index({ userId: 1, loc: '2dsphere' });
	mongoose.model('PredictToken', predictTokenSchema);
};
