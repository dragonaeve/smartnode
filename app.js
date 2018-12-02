var express = require('express'),
	//dependencies
	bodyParser = require('body-parser'),
	path = require('path'),
  app = express(),
  //default port
  port = 3000,
  //mongodb mongoose db
  mongoose = require('mongoose'),
  Sensor = require('./models/SensorModel'),
  Node = require('./models/NodeModel');
  Data = require('./models/DataModel');

  mongoose.connect('mongodb+srv://admin:admin@annachow-hjvei.mongodb.net/test?retryWrites=true');
//view-engine setup
app.set('views', path.join(__dirname, 'public', 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

//importing route
var routes = require('./api/routes/SensorRoutes.js');
app.use('/', routes);
module.exports = app;

app.listen(port);
console.log('Server started on:' + port);
