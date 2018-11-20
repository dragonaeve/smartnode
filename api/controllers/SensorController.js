var mongoose = require('mongoose'),
	Sensor = mongoose.model('SensorSchema');

exports.get_all_sensors = function(req, res) {
	Sensor.find({}, function(err, Sensor) {
		if (err){
			res.send(err);
		}
		else{
			res.format({
				html: function(){
					res.render('index',{
						title: 'Sample Node',
						"sensor": Sensor
					});
				},
				json: function(){
					res.json(Sensor);
				}
			});
		}
	});
};