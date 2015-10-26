'use strict'

var express = require('express');
var request = require('request');

module.exports = function(_router, app){
	let router = express.Router();
	_router.use('/doc', router);

	router.get('/recommand', function(req, res){
		// formatting /search/<user_id>/<query>
		var user_id = encodeURIComponent(req.query.user_id);
		var query = encodeURIComponent(req.query.query);
		var path = '/search/'+user_id+'/'+query;
		var uri = 'http://localhost:5000' + path

		request({
			url: uri
			, method: 'POST'
		}, function(error, response, body){
			if (error) {
				res.send('{"error" : "Error on document recommand", "path" : "'+path+'"}');
			} else {
				res.send(body)
			}
		})
	})

	router.get('/log', function(req, res){
		// formatting /search/<user_id>/<article_id>/query
		var user_id = encodeURIComponent(req.query.user_id);
		var article_id = encodeURIComponent(req.query.article_id);
		var query = encodeURIComponent(req.query.query);
		var path = '/searchLog/'+user_id+'/'+article_id+'/'+query;
		var uri = 'http://localhost:5000' + path

		request({
			uri : uri
			, method: 'POST'
		}, function(error, response, body){
			if (error) {
				res.send('{"error" : "Error on article logging');
			} else {
				res.send('{"success" : "Article logging success"');
			}
		})
	})

}

