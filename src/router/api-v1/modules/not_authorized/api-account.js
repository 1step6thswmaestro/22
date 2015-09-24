var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var passport = require('passport');



module.exports = function(router, app){
	router.post('/signup', app.needUnathorization, function(req, res){
		var body = req.body;
		var login_params = _.pick(body, 'email', 'passwd');

		var user = new Account(login_params);
		user.save(function(err, card){
			if(err){
				logger.error(e);
				res.sendStatus(500);
				return;
			}

			res.redirect('/signin');
		});
	});

	router.post('/signin', app.needUnathorization, function(req, res){
		var body = req.body;
		var login_params = _.pick(body, 'email', 'passwd');

		if(req.user){
			res.redirect('/');
		}
		else{
			var auth = passport.authenticate('local', {
				failureRedirect: '/signin'
				, successRedirect: '/'
			});
			auth.apply(this, arguments);
		}
	});

	router.get('/logout', app.needAuthorization, function(req, res){
		req.logout();
		res.redirect('/')
	});
}
