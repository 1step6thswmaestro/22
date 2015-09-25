var mongoose = require('mongoose');
var Task = mongoose.model('Task');

module.exports = function(router, app){
	router.get('/testcommand_droptasks', function(req, res){
		// This request removes every tasks related to the current user.
		Task.remove({user_id: req.user._id}, function(err){
			if (err) return res.send(err);
			res.send('remove done.');
		});
	})

	router.get('/tasks', function(req, res){
		// This request returns all tasks that are saved for the user.
		Task.find({user_id: req.user._id}, function(err, tasks) {
		  if (err) return res.send(err);
		  res.send(tasks);
		});
	})

	router.post('/tasks', function(req, res){
		// This request create new task for the current user.
		myTask  = new Task({
			user_id: req.user._id,
			name: req.body.name
			// TODO: Append more properties here.
		});
		myTask.save(function(err) {
		  if (!err){
				return console.log("created");
				res.send('created.<br/>'+myTask);
			}
			else{
				return console.log(err);
			}
		});
	})

	router.get('/tasks/:id', function(req, res){
		// This request returns all tasks that are saved for the user.
		res.send('SORRY! You cannot access taskid: ' + req.params.id + '<br/>This not a valid access method.');
	})

	router.delete('/tasks/:id', function(req, res){
			// This request delete specific task.
			Task.remove({user_id: req.user._id, _id: req.params.id}, function(err){
				if (err) return res.send(err);
				res.send('remove done.');
			});
	})
}
