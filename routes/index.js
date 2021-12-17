var express = require('express');
var router = express.Router();
var AppClient = require('../socket/client')

var client = new AppClient()
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/id', function (req, res, next) {
  console.log(client.sensordata)
  res.render('index', { title: 'Express' });
});


module.exports = router;
