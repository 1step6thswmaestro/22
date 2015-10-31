global.__base = __dirname;

var app = require('./app/app.js')({
	rootdir: __dirname
});

app.start();
