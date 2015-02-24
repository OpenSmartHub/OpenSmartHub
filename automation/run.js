var sparkInit = require('./automation_modules/devices/spark/sparkInit.js');
var buttonToLight = require('./automation_modules/buttonToLight.js');
var config = require('./config.js');

spark = sparkInit.init(config.SPARK_USERNAME, config.SPARK_PASSWORD);
buttonToLight.init(spark,1,0);