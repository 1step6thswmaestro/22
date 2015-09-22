var mongoose 	= require('mongoose');
var db			= mongoose.connection;
var Q			= require('q');


module.exports = function(app){
	app.connectMongo = function(){
		logger.log('* mongodb - connecting ...');
		
		var deferred = Q.defer();
		db.on('error', function(){
			logger.error.bind(console, '@ db connection error.').apply(arguments);
			deferred.reject.apply(deferred, arguments);
		});
		db.once('open', function(){
			logger.log('* mongodb - connected.');
			deferred.resolve();
		});

		mongoose.connect(app.config.db);

		return deferred.promise;
	}
}