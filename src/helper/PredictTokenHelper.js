'use strict'

var mongoose = require('mongoose');
var PredictToken = mongoose.model('PredictToken');
var Q = require('q');

function init(app){
	var helper = app.helper;
	var lastUpdateTime = {}
	
	function PredictTokenHelper(){
	}

	PredictTokenHelper.prototype.create = function(doc){
		let token = new PredictToken(doc);
		return Q.nbind(token.save, token)()
		.then(function(obj){
			return obj[0];
		})
	}

	app.helper.predictToken = new PredictTokenHelper();
}

module.exports = init;