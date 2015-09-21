var express = require('express');
var bodyParser = require('body-parser')

module.exports = function(app){
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(bodyParser.json());
	app.use('/', express.static('./public/resources/nativeAssets'));
 	app.use('/', express.static('./public/resources/bowerAssets'));
 	app.use(function(req, res, next){
	 	res.render = function(filename){
	 		this.sendFile(app.rootdir + '/frontend/compiled/' + filename);
	 	}
	 	next();
 	});
}
