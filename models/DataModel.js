'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DataSchema = new Schema({
	sensorName: String,
	data: [{
		timestamp: Date,
		status: Number,
		value: Number,
		dataType: String
	}]
});

module.exports = mongoose.model('DataSchema', DataSchema);