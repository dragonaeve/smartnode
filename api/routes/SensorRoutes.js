var express = require('express');
var router = express.Router();
var sensorsList = require('../controllers/SensorController');
		
router.get('/', sensorsList.index);

router.get('/sensors', sensorsList.get_all_sensors);

//get addSensor form, post create new sensor
router.get('/addSensor', sensorsList.add_a_sensor);
router.post('/addSensor', sensorsList.create_a_sensor, sensorsList.create_sensor_data);

//sensor API, get, update, delete
router.get('/:sensorName/edit', sensorsList.get_editsensor);
router.put('/:sensorName/edit', sensorsList.update_sensor);
router.delete('/:sensorName/edit', sensorsList.delete_sensor);
router.delete('/deleteAll', sensorsList.delete_all);
router.delete('/deleteAllData', sensorsList.delete_all_data);
//view data for one sensor
router.get('/:sensorName/data', sensorsList.get_all_data);
	
module.exports = router;