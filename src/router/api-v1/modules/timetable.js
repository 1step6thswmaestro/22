'use strict'

var mongoose = require('mongoose');
var Timetable = mongoose.model('Timetable');
var Q = require('q');

module.exports = function(router, app){
	let helper = app.helper;

	router.get('/timetable', function(req, res){
		helper.timetable.find(req.user, req.query)
		.then(list=>res.send(list));
	})
}
