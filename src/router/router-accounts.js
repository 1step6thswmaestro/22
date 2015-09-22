var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var passport = require('passport');

module.exports = function(app){
	app.get('/signin', function(req, res){
		res.render('accounts/signin.html')
	});
	app.get('/signup', function(req, res){
		res.render('accounts/signup.html')
	});

	app.post('/v1/signup', function(req, res){
		var body = req.body;
		var login_params = _.pick(body, 'email', 'passwd');

		if(req.user){
			res.redirect('/');
		}
		else{
			var user = new Account(login_params);
			user.save(function(err, card){
				if(err){
					console.log('error');
					res.sendStatus(500)
					return;
				}

				res.redirect('/signin');
			})
		}
	});

	app.post('/v1/signin', function(req, res){
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
	})

	app.get('/v1/logout', function(req, res){
		req.logout();
		res.redirect('/')
	})
}
