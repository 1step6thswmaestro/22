module.exports = function(app){

	app.get('/tasks.json', function(req, res){
		res.render('todo/tasks.json')
	});
	
	app.get('/', function(req, res){
		res.renderIndex();
	});

}
