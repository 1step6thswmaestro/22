var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');

module.exports = function(app){
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(bodyParser.json());
	app.use('/', express.static('./public/resources/nativeAssets'));
 	app.use('/', express.static('./public/resources/bowerAssets'));
 	app.use(function(req, res, next){
	 	res.render = render.bind(res);
	 	next();
 	});

 	function render(filename){
		this.sendFile(path.resolve(app.rootdir, './../public/resources/nativeAssets/' + filename));
	}
}
