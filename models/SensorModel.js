'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SensorSchema = new Schema({
	sensorName: String,
	sensorType: String,
	statistics: [{
		timestamp: Date,
		status: Number,
		value: Number,
		dataType: String
	}]
});

module.exports = mongoose.model('SensorSchema', SensorSchema);