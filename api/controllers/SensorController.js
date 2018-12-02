var mongoose = require('mongoose'),
	express = require('express'),
	router = express.Router(),
	Sensor = mongoose.model('SensorSchema');
	Data = mongoose.model('DataSchema');

//sensor types, associated datatype, value range
var light = ['watts', 0, 101],
	motion = ['motion', 0, 2];
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
//simulate invertal
var simulate = setInterval(changeAllStats, 30000);
var sendsim = setInterval(sendData, 30000);
//change all sensor simulation stats
function changeAllStats(){
	Sensor.find({}, function(err, sensors) {
		console.log('change all sensors');
		if (err){
			res.send(err);
		}
		else if (sensors==null){
			console.log('No sensors found');
		}
		else{
			console.log('retrieving all sensors');
			for(i in sensors){
				changeStats(sensors[i].sensorName);
			}
		}
	});
};
//helper fn to simulate one sensor stats
function changeStats(sName){
	Sensor.findOne({sensorName: sName},function(err, sensor){
		var type = getTypeStats(sensor.sensorType);
		var min = type[1];
		var max = type[2];

		var time = Date(Date.now());
		var stat = Math.floor(Math.random() * 5);
		var val = Math.floor(Math.random() * (max - min) ) + min;
		if (stat != 1){
			val = 0;
		}
		sensor.update({
			statistics: [{
				timestamp: time,
				status: stat,
				value: val
			}]
		}, function (err, sensor) {
			if (err) {
				console.log("There was a problem updating the information to the database: " + err);
			} 
			else {
				console.log(sensor)
			}
		})
	});
};

//send all sensor stats to data table
function sendData(){
	Sensor.find({}, function(err, sensors) {
		console.log('send all stats');
		if (err){
			res.send(err);
		}
		else if (sensors==null){
			console.log('No sensors found');
		}
		else{
			console.log('retrieving all sensors');
			for(i in sensors){
				grabStats(sensors[i].sensorName);
			}
		}
	});
};
//for each sensor, grab stat vars and append to data table
function grabStats(sName){
	Sensor.findOne({sensorName: sName},function(err, sensor){
		if (err){
			console.log(err);
		}
		else{
			console.log(sensor);
			var time = sensor.statistics[0].timestamp;
			var stat = sensor.statistics[0].status;
			var val = sensor.statistics[0].value;
			var type = sensor.statistics[0].dataType;
			var dat = {"timestamp": time, "status": stat, 
			"value": val, "dataType": type}
			Data.findOneAndUpdate({sensorName: sName}, 
				{$push: {data: dat}}, function(err, data){
				if (err){
					console.log(err);
				}
				else if (data==null){
					console.log('No data table found');
				}
				else{
					console.log(data);
				}
			});
		}
	});
};
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
					res.render('sensors',{
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
//create sensor to mongo
module.exports.create_a_sensor = function(req,res,next){
	var name = req.body.sensorName;
	var type = req.body.sensorType;
	var timeStamp = Date(Date.now());
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
		}
		next();
	})
};
//create associated data table
module.exports.create_sensor_data = function(req,res){
	var name = req.body.sensorName;
	var type = req.body.sensorType;
	var timeStamp = Date(Date.now());
	Data.create({
		sensorName: name,
		data: [{
			timestamp: timeStamp,
			status: 0,
			value: 0,
			dataType: getTypeStats(type)[0]
		}]
	},function(err, Data){
		if(err){
			res.send(err)
		}else{
			console.log('POST creating new sensor data table: '+Data);
			res.format({
					html: function(){
							res.redirect("/sensors");
					},
					json: function(){
							res.json(Data);
					}
			});
		}
	})
};

module.exports.delete_sensor = function(req, res) {
	Sensor.findOne({sensorName: req.params.sensorName}, function(err, sensor) {
		console.log('DELETE sensor: ', req.params.sensorName);
		if (err){
			console.error(err);
			res.send(err);
		}
		else if (sensor == null){
			res.status(404).send("Sensor not found");
		}
		else{
			sensor.remove(function (err, sensor) {
				if (err) {
					return console.error(err);
				}
				else {
					//Returning success messages saying it was deleted
					console.log('DELETE ' + sensor.sensorName);
					res.format({
						//HTML returns us back to the main page, or you can create a success page
						html: function(){
							res.redirect("/sensors");
						},
						//JSON returns the item with the message that is has been deleted
						json: function(){
							res.json({message : 'deleted', item : sensor});
						}
					});
				}
			});
		}
	})
};

module.exports.delete_all = function(req, res){
	Sensor.remove({}, function(err, sensor) {
		if (err)
			res.send(err);
		res.json(sensor);
	});
};

module.exports.delete_all_data = function(req, res){
	Data.remove({}, function(err, data) {
		if (err)
			res.send(err);
		res.json(data);
	});
};

module.exports.get_all_data = function(req, res, next) {
	Data.findOne({sensorName: req.params.sensorName}, function(err, data) {
		console.log('GET all data of', req.params.sensorName);
		console.log(data);
		if (err){
			res.send(err);
		}
		else if (data == null){
			res.status(404).send("Data table not found");
		}
		else{
			res.format({
				html: function(){
					res.render('data',{
						title: data.sensorName,
						"dt": data
					});
				},
				json: function(){
					res.json(data);
				}
			});
		}
	});
};
