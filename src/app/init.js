var express = require('express');
var bodyParser = require('body-parser')

module.exports = function(app){
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(bodyParser.json());
	app.use('/', express.static('./src/frontend/compiled'));
 	app.use('/', express.static('./src/frontend/resources/bowerAssets'));
 	app.use(function(req, res, next){
	 	res.render = function(filename){
	 		this.sendFile(app.rootdir + '/frontend/compiled/' + filename);
	 	}
	 	next();
 	});
}
