var express = require('express'),
	//dependencies
	bodyParser = require('body-parser'),
	path = require('path'),
  app = express(),
  //default port
  port = process.env.PORT || 3000,
  //mongodb mongoose db
  mongoose = require('mongoose'),
  Sensor = require('./models/SensorModel'),
  Node = require('./models/NodeModel');

//view-engine setup
app.set('views', path.join(__dirname, 'public', 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index); //index page
//importing route
var routes = require('./api/routes/SensorRoutes.js');
routes(app); //register the route

app.listen(port);
app.listen(3000);
console.log('Server started on: ' + port);
