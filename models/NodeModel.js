'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var NodeSchema = new Schema({
	nodeName: String,
	status: String,
	sensors: [{
			sensorName: String,
			status: String,
			sensorType: String
	}];

module.exports = mongoose.model('NodeSchema', NodeSchema);