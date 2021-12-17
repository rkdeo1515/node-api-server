var express = require('express');
var router = express.Router();

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

module.exports = router;
