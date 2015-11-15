'use strict'

var express = require('express');
var fs = require('fs');

var mongoose = require('mongoose');
var ConnectionLog = mongoose.model('ConnectionLog');
var Account = mongoose.model('Account');



module.exports = function(app){
	var router_auth = express.Router();
	router_auth.use('/', app.needAuthorization);

	router_auth.post('/connections/alive', function(req, res){
		var newLog = new ConnectionLog({
			'userId': req.user._id,
			'loc': {
				type: 'Point',
				coordinates: [ Number(req.body.lon), Number(req.body.lat) ]
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

	router_auth.get('/locs', function(req, res){
		Account.findOne({'_id' :req.user._id}, function (err, account){
			if (err) return handleError(err);
			var locations = [account.locHome, account.locSchool, account.locWork, account.locEtc];

			if (req.query.lat && req.query.lon){
				// If coordinate info is in the request, it is locatino query request.
				// So return the name of location. If not sure, return 'unknown'
				var queryPoint= [ Number(req.query.lon), Number(req.query.lat) ];

				var dist = function(p1, p2){
					// console.log('calc distance', p1, p2);
					var R = 6371; // km
					var dLat = (p2[1]-p1[1])*(Math.PI / 180);
					var dLon = (p2[0]-p1[0])*(Math.PI / 180);
					var lat1 = p1[1]*(Math.PI / 180);
					var lat2 = p2[1]*(Math.PI / 180);

					var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
					        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
					var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
					var d = R * c;
					return d;
				}

				var names = ['home', 'school', 'work', 'etc'];
				for (let i = 0 ; i < 4; i++){
					if (locations[i].coordinates.length != 2){
						// If location is not saved, skip.
						continue;
					}
					let distance = dist(locations[i].coordinates, queryPoint);
					// console.log('distance from ', names[i], ': ', distance);
					if (Math.abs(distance) < 5){
						// less than 5 km
						res.send({name:names[i]});
						return;
					}
				}
				res.send({name:'unknown'});
			}
			else{
				res.send(locations);
			}
		});
	})

	router_auth.post('/locs/:label', function(req, res){
		// Save recieved location info to location of the label.
		// recieved data has this form. {type : "Point", coordinates: [100.0, 0.0]}
		console.log('body:', req.body)
		let locInfo = _.pick(req.body, ['type', 'coordinates']);
		if(locInfo.coordinates){
			// convert string to number
			locInfo.coordinates = [ Number(locInfo.coordinates[0]), Number(locInfo.coordinates[1]) ];
		}
		else{
			locInfo = _.extend(locInfo, {coordinates: []});
		}
		if (req.params.label == 'home'){
			Account.update({_id: req.user._id}, {locHome: locInfo}, function(err, affected, resp) {
				if (err) return console.error(err);
				res.send('ok');
			})
		}
		else if(req.params.label == 'school'){
			Account.update({_id: req.user._id}, {locSchool: locInfo}, function(err, affected, resp) {
				if (err) return console.error(err);
				res.send('ok');
			})
		}
		else if(req.params.label == 'work'){
			Account.update({_id: req.user._id}, {locWork: locInfo}, function(err, affected, resp) {
				if (err) return console.error(err);
				res.send('ok');
			})
		}
		else if(req.params.label == 'etc'){
			Account.update({_id: req.user._id}, {locEtc: locInfo}, function(err, affected, resp) {
				if (err) return console.error(err);
				res.send('ok');
			})
		}
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
