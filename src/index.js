global.__base = __dirname;
global.getConfig = function(name){
	return require(__dirname + '/../config/' + name);
}

var app = require('./app/app.js')({
	rootdir: __dirname
});

app.start();
