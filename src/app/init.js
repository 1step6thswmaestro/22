var express 		= require('express');
var bodyParser		= require('body-parser')
var path			= require('path');
var passport		= require('passport');
var session			= require('express-session');
var connect_mongo	= require('connect-mongo')(session);
var mongoose		= require('mongoose');

module.exports = function(app){
	Object.defineProperty(global, '_', {
		value: require('underscore')
		, configurable: false
	})

	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(bodyParser.json());

	var hour = 3600000;
	app.use(session({
		secret: 'session-secret'
		, cookie: {
			path: '/'
			, httpOnly: true
			, maxAge: hour * 24 * 7
		}
		, resave: true
		, saveUninitialized: true
		, store: new connect_mongo({
			mongooseConnection: mongoose.connection
			, collection: 'sessions'
		})
	}))

	app.use(passport.initialize());
	app.use(passport.session());
	app.use('/', express.static('./public/resources/nativeAssets', {index: false}));
 	app.use('/', express.static('./public/resources/bowerAssets', {index: false}));
 	app.use('/', express.static('./public/resources/staticAssets/startbootstrap-landing-page-1.0.4', {index: false}));
 	app.use(function(req, res, next){
	 	res.render = render.bind(res);
	 	res.renderIndex = renderIndex.bind(res);
	 	next();
 	});
 	app.use(function(req, res, next){
 		if(!req.user && (req.url != '/signin' && req.url != '/v1/signin' && req.url != '/signup' && req.url != '/v1/signup')){
 			res.redirect('/signin');
 		}
 		else{
 			next();
 		}
 	});

 	function render(filename){
		this.sendFile(path.resolve(app.rootdir, './../public/resources/nativeAssets/' + filename));
	}

	function renderIndex(){
		this.render('todo/index.html');
	}

	app.needAuthorization = function(req, res, next){
		if(!req.user){
			res.redirect(app.config.index);
		}
		else{
			next();
		}
	}

	app.needUnathorization = function(req, res, next){
		if(req.user){
			res.redirect(app.config.index);
		}
		else{
			next();
		}
	}
}
