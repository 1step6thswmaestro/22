'use strict'

module.exports = function(app){
	app.get('/', app.needAuthorization, function(req, res){
		let query = req.query || {};
		switch(query.state){
			case 'feedly-auth2-auth':
				app.helper.feedly.processAuthCode(req.user, query.code)
				.then(function(){
					res.redirect('/');
				});
			break;
			default:
				res.renderIndex();
				break;
		}
	});
	app.get('/signin', app.needUnathorization, function(req, res){
		res.render('accounts/signin.html')
	});
	app.get('/signup', app.needUnathorization, function(req, res){
		res.render('accounts/signup.html')
	});

	app.use('/v1', require('./api-v1/api-router-v1')(app));
}
