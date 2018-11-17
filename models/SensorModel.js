'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SensorSchema = new Schema({
	sensorName: String,
	sensorId: String,
	statistics: [{
		measurement: String,
		timestamp: Date,
		data: [{
			status: Number,
			value: Number,
			dataType: String
		}]
	}]
});

module.exports = mongoose.model('SensorSchema', SensorSchema);