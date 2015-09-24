var express = require('express');
var fs = require('fs');

module.exports = function(app){
	var router_auth = express.Router();
	router_auth.use('/', app.needAuthorization);
	fs.readdirSync(__dirname + '/modules').forEach(function(file){
		if(file.search(/.*?\.js/) != -1){
			require(__dirname + '/modules/' + file)(router_auth, app);
		}
	});

	var router_n_auth = express.Router();
	fs.readdirSync(__dirname + '/modules/not_authorized/').forEach(function(file){
		if(file.search(/.*?\.js/) != -1){
			require(__dirname + '/modules/not_authorized/' + file)(router_n_auth, app);
		}
	});

	return [router_n_auth, router_auth];
}
