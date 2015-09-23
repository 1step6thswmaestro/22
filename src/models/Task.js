var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(app){
	var schema = Schema({
		title: String,
		desc: String,
	});

	mongoose.model('Todo', schema);
};
