var restify = require('restify');
var sparkInit = require('./automation_modules/devices/spark/sparkInit.js');
//var buttonToLight = require('./automation_modules/buttonToLight.js');
var buttonToWemo = require('./automation_modules/sparkButtonToWemoSwitch.js');
// var moteli = require('./automation_modules/moTeLi.js');
var config = require('./config.js');

var server = restify.createServer();

server.post('/data', function create(req, res, next) {
  res.send(201, "Data uploaded");
  return next();
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

spark = sparkInit.init(config.SPARK_USERNAME, config.SPARK_PASSWORD);
//buttonToLight.init(spark,1,0);
buttonToWemo.init(spark,1,config.WEMO_SWITCH_NAME);
// moteli.init(spark, 1);