'use strict';

var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var settings = require('./settings.json').mongo;

var apps = require('./api/apps');

var app = express();

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(__dirname + '/.generated'));
app.use(express.static(__dirname + '/app'));

app.use('/api/apps', apps);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		console.error(err.stack);
		res.json({error: 'oops'});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.send(err);
});

app.get('/*', function (req, res, next) {
	// Just send the index.html for other files to support HTML5Mode
	res.sendFile(__dirname + '/app/index.html');
});

// connect to mongodb
var connectString = 'mongodb://' + settings.username + ':' + settings.password + '@' +
	settings.connection.host + ':' + settings.connection.port + '/' + settings.database;

mongoose.connect(connectString);

module.exports = app;
