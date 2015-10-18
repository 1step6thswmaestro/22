var express = require('express');
var fs = require('fs');

var mongoose = require('mongoose');
var ConnectionLog = mongoose.model('ConnectionLog');

module.exports = function(app){
	var router_auth = express.Router();
	router_auth.use('/', app.needAuthorization);

	router_auth.post('/connections/alive', function(req, res){
		var newLog = new ConnectionLog({
			'userId': req.user._id,
			'loc': {
				type: 'Point',
				coordinates: [ req.body.lat, req.body.lon ]
			 }
		});
		newLog.save(function (err, obj){
			if (err) return console.error(err);
			return res.send(obj);
		})
	})

	router_auth.get('/connections/drop', function(req, res){
		ConnectionLog.remove({'userId' :req.user._id}, function (err){
			if (err) return console.error(err);
			res.send('ok');
		});
	})

	router_auth.get('/connections', function(req, res){
		ConnectionLog.find({'userId' :req.user._id}, function (err, connection){
			if (err) return console.error(err);
			res.send(connection);
		});
	})



	fs.readdirSync(__dirname + '/modules').forEach(function(file){
		if(file.search(/.*?\.js$/) != -1){
			require(__dirname + '/modules/' + file)(router_auth, app);
		}
	});

	var router_n_auth = express.Router();
	fs.readdirSync(__dirname + '/modules/not_authorized/').forEach(function(file){
		if(file.search(/.*?\.js$/) != -1){
			require(__dirname + '/modules/not_authorized/' + file)(router_n_auth, app);
		}
	});

	return [router_n_auth, router_auth];
}
