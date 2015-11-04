'use strict'

var mongoose = require('mongoose');
var Timetable = mongoose.model('Timetable');
var TableMaker = require('../../../taskprocess/tablemaker');
var Q = require('q');

module.exports = function(router, app){
	let helper = app.helper;
	let tableMaker = new TableMaker(app);

	router.get('/timetable', function(req, res){
		helper.timetable.find(req.user, req.query)
		.then(events=>tableMaker.make(req.user._id, events))
		.then(list=>{res.send(list);})
		.fail(err=>console.log(err));
	})

	router.put('/timetable', function(req, res){
		helper.timetable.find(req.user, {update: true, reset: false})
		.then(events=>tableMaker.make(req.user._id, events))
		.then(list=>{res.send(list);})
		.fail(err=>console.log(err));
	})
}
