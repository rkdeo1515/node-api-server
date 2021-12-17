var express = require('express');
var router = express.Router();
var AppClient = require('../socket/client')


var client = new AppClient()

var info = {
  id: '0x00',
  rssi: 'rssi_val',
  temp: 'temp_val',
  hum: 'hum_val',
}

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.send(JSON.stringify(info));
});

router.get('/id', function(req, res, next) {
  res.send(client.sensordata.extAddr);
});

router.get('/rssi', function(req, res, next) {
  res.send(client.sensordata.rssi);
});

router.get('/temp', function(req, res, next) {
  res.send(client.sensordata.tempSensor);
});

router.get('/hum_val', function(req, res, next) {
  res.send(info.hum);
});



module.exports = router;
