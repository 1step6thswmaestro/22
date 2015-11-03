'use strict'

var express = require('express');

module.exports = function(_router, app){
	let helper = app.helper;
	let router = express.Router();
	_router.use('/user', router);

	router.get('/status', function(req, res){
		let user = req.user;
		let status = {
			intergration: {}
		};

		if(user.feedly && user.feedly.access_token){
			status.intergration.feedly = true
		}

		try{
			if(user.thirdparty.google.auth.access_token){
				status.intergration.google = true;
			}
		}
		catch(e){

		}

		res.send(status);
	})
}