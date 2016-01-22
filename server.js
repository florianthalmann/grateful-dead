(function() {
	
	var fs = require("fs");
	var express = require('express');
	var bodyParser = require('body-parser');
	
	var app = express();
	
	app.use(express["static"](__dirname + '/app'));
	app.use(bodyParser.json({limit: '50mb'}));
	
	app.listen("8090");
	
	console.log('Server started at http://localhost:8090');
	
}).call(this);
