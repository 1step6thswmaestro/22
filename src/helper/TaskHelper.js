var mongoose = require('mongoose');
var Task = mongoose.model('Task');
var Q = require('q');

function init(app){
	function TaskHelper(){
	}

	TaskHelper.prototype.find = function(userId, query, proj, opt){
		opt = opt || {};
		opt.sort = opt.sort || {created: 1};
		return Q.nbind(Task.find, Task)(Object.assign({userId}, query), proj, opt);
	}

	app.helper.taskHelper = new TaskHelper();
}

module.exports = init;
