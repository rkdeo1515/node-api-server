var express = require('express');
var router = express.Router();
var AppClient = require('../socket/client')


var client = new AppClient()

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.send(JSON.stringify(client.sensordata));
});

router.get('/id', function(req, res, next) {
  res.send(client.sensordata.id);
});

router.get('/rssi', function(req, res, next) {
  res.send(String(client.sensordata.rssi));
});

router.get('/temp', function(req, res, next) {
  res.send(client.sensordata.temp);
});

router.get('/hum', function(req, res, next) {
  res.send(client.sensordata.hum);
});



module.exports = router;
