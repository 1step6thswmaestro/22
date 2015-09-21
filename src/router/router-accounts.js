module.exports = function(app){
	app.get('/signup', function(req, res){
		res.render('accounts/signup.html')
	});

	app.post('/signup_test', function(req, res){
		var body = req.body;
		res.send({message: 'congratulations!'});
	});
}
