module.exports = function(app) {
	var sensorsList = require('../controllers/SensorController');
		
	app.route('/')
		.get(sensorsList.get_all_sensors);

	// app.route('/:sensorName')
	// 	.get(sensorsList.get_sensor)
	// 	.put(sensorsList.update_sensor)
	// 	.delete(sensorsList.delete_sensor);

	// app.route('/:sensorName/data')
	// 	.get(sensorsList.get_all_data);

	// app.route('/addSensor')
	// 	.get(sensorsList.add_a_sensor)
	// 	.post(sensorsList.create_a_sensor);
	
};