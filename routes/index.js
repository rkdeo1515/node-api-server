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
  res.send(info.id);
});

router.get('/rssi', function(req, res, next) {
  res.send(info.rssi);
});

router.get('/temp', function(req, res, next) {
  res.send(info.temp);
});

router.get('/hum_val', function(req, res, next) {
  res.send(info.hum);
});

router.get('/example', function (req, res, next) {
  console.log(client.sensordata)
  res.render('index', { title: 'Express' });
});


module.exports = router;
