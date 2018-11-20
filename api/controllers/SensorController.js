var mongoose = require('mongoose'),
	express = require('express'),
	router = express.Router(),
	Sensor = mongoose.model('SensorSchema');
	Data = mongoose.model('DataSchema');

//sensor types, associated datatype, value range
var light = ['watts', 0, 100],
	motion = ['motion', 0, 1];
	unknown = ['unknown', -1, -1];
function getTypeStats(type){
	if (type == 'light'){
		return light;
	}else if( type == 'motion'){
		return motion;
	}
	else{
		return unknown;
	}
}

//helper fn convert status int to string
function convertStatus(num){
	if (num==0){
		return 'Inactive';
	}else if (num==1){
		return 'Active';
	}else if (num==2){
		return 'Maintenance';
	}else if (num==3){
		return 'Turning On';
	}else if (num==4){
		return 'Turning Off';
	}else{
		return 'Invalid Number';
	}
}

//interval fn to change all sensor simulation stats

//helper fn to simulate one sensor stats

//interval fn to send all sensor stats to data table
//for each sensor, grab stat vars and append to data table
//if sensor data table does not exist, create one

//index page
module.exports.index = function(req, res, next){
		Sensor.find({}, function(err, Sensor) {
		console.log('GET index page');
		if (err){
			res.send(err);
		}
		else{
			res.format({
				html: function(){
					res.render('index',{
						title: 'Sample Node',
						"sensors": Sensor
					});
				},
				json: function(){
					res.json(Sensor);
				}
			});
		}
	});
};

//sensors api page
module.exports.get_all_sensors = function(req, res, next) {
	Sensor.find({}, function(err, Sensor) {
		console.log('GET all sensors');
		if (err){
			res.send(err);
		}
		else{
			res.format({
				html: function(){
					res.render('index',{
						title: 'Sample Node',
						"sensors": Sensor
					});
				},
				json: function(){
					res.json(Sensor);
				}
			});
		}
	});
};

//add sensor form
module.exports.add_a_sensor = function(req,res){
	res.render('addsensor', {title: 'Add Sensor'});
	console.log('GET add sensor');
};
//create sensor to mongo, create associated data table
module.exports.create_a_sensor = function(req,res){
	var name = req.body.sensorName;
	var type = req.body.sensorType;
	var timeStamp = Math.floor(Date.now() / 1000);
	//add a check for sensorName
	Sensor.create({
		sensorName: name,
		sensorType: type,
		statistics: [{
			timestamp: timeStamp,
			status: 0,
			value: 0,
			dataType: getTypeStats(type)[0]
		}]
	}, function(err, Sensor){
		if(err){
			res.send(err)
		}else{
			console.log('POST creating new sensor: '+Sensor);
			res.format({
					html: function(){
							res.redirect("/sensors");
					},
					json: function(){
							res.json(Sensor);
					}
			});
		}
	})

	Data.create({
		sensorName: name,
		data: [{
			timestamp: timeStamp,
			status: 0,
			value: 0,
			dataType: getTypeStats(type)[0]
		}]
	})
};
