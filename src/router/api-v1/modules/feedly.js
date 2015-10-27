'use strict'

var express = require('express');
var feedly_connector = require('../../../app/feedly_connector');
var Futures = require('futures');

// /v1/feedly/logon
// /v1/feedly/status/change

module.exports = function(_router, app){
	let router = express.Router();
	_router.use('/feedly', router);

	var user_id = res.query.user_id;
	var inst = new feedly_connector(res.query.user_id);

	router.get('/logon', function(req, res){
		inst.logon(uesr_id, function(err, status){
			if (err) {
				logger.error(err);
				return ;
			}
			res.send(status);
		});
	});

	router.get('/status/change', function(req, res){
		inst.change_status(user_id, function(err, status){
			if (err) {
				logger.error(err);
				return ;
			}
			res.send(status);
		});
	});
}