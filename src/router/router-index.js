module.exports = function(app){
	app.get('/', app.needAuthorization, function(req, res){
		res.renderIndex();
	});
	app.get('/signin', app.needUnathorization, function(req, res){
		res.render('accounts/signin.html')
	});
	app.get('/signup', app.needUnathorization, function(req, res){
		res.render('accounts/signup.html')
	});

	app.use('/v1', require('./api-v1/api-router-v1')(app));
}
