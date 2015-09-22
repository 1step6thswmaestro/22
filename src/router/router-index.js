module.exports = function(app){
	app.get('/', function(req, res){
		console.log('user : ', req.user);
		res.render('index.html');
	});
}
