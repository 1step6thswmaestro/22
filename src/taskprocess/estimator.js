'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');

class TimeEstimator{
	constructor(app){
		this.app = app;
	}

	estimate(taskName){
		return Q(10);
	}
}

module.exports = TimeEstimator;
