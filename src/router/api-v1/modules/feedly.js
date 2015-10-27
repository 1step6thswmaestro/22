'use strict'

var express = require('express');
var Futures = require('futures');
var feedly_connector = require('../../../app/feedly_connector');

module.exports = function(_router, app){
	let router = express.Router();
	_router.use('/feedly', router);

	router.get('/logon', function(req, res){
		var user_id = req.query.user_id;
		var inst = new feedly_connector();
		inst.logon(user_id, function(err, status){
			if (err) {
				logger.error(err);
				return ;
			}
			res.sendStatus(status);
		});
	});

	router.get('/status/change', function(req, res){
		var user_id = req.query.user_id;
		var inst = new feedly_connector();
		inst.change_status(user_id, function(err, status){
			if (err) {
				logger.error(err);
				return ;
			}
			res.sendStatus(status);
		});
	});
}