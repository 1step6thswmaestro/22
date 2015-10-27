'use strict'

var express = require('express');
var feedly_connector = require('../../../app/feedly_connector');
var Futures = require('futures');

// /v1/feedly/logon
// /v1/feedly/status/change

module.exports = function(_router, app){
	let router = express.Router();
	_router.use('/feedly', router);

	router.get('/logon', function(req, res){
		var inst = new feedly_connector(res.query.user_id);
		inst.get_or_create_status(function(status){

		})
	});

	router.get('/status/change', function(req, res){
		var inst = new feedly_connector(res.query.user_id);
		

		inst.update(function(msg){
			res.send(msg);
		});

		inst.logout(function(msg){
			res.send(msg);
		});
	});
}