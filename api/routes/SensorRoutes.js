var express = require('express');
var router = express.Router();
var sensorsList = require('../controllers/SensorController');
		
router.get('/', sensorsList.index);

router.get('/sensors', sensorsList.get_all_sensors);

// app.route('/:sensorName')
// 	.get(sensorsList.get_sensor)
// 	.put(sensorsList.update_sensor)
// 	.delete(sensorsList.delete_sensor);

//view data for one sensor
router.get('/:sensorName/data', sensorsList.get_all_data);

//get addSensor form, post create new sensor
router.get('/addSensor', sensorsList.add_a_sensor);
router.post('/addSensor', sensorsList.create_a_sensor);
	
module.exports = router;