'use strict'

var passport	= require('passport')
	, mongoose	= require('mongoose')
	, Account	= mongoose.model('Account')
	, LocalStrategy	= require('passport-local').Strategy;
;

module.exports = function(core_object){
	passport.serializeUser(function(user, done){
		done(null, user._id);
	});

	passport.deserializeUser(function(_id, done){
		Account.findOne({_id}, done);
	});

	passport.use(new LocalStrategy({
		usernameField: 'email'
		, passwordField: 'passwd'
	}, function(email, passwd, done){
		Account.findOne({email: email}, function(err, user){
			if(err) return done(err);

			if(!user){
				logger.log('('+email+') is unknown email');
				return done(null, false, {message: 'unknown user'});
			}

			if(!user.authenticate(passwd)){
				logger.log('('+email+') is invalid passwd');
				return done(null, false, {message: 'invalid passwd'});	
			}

			return done(null, user);
		})
	}));
}