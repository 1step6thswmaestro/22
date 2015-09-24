module.exports = function(router, app){
	router.get('/sample_data', function(req, res){
		res.render('todo/tasks.json');
	})
}
