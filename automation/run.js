// Requires for Scripts
var sparkInit = require('./automation_modules/devices/spark/sparkInit.js');
var SparkButtonToSparkRGB = require('./automation_modules/sparkButtonToSparkRGB.js').SparkButtonToSparkRGB;
var SparkButtonToWemoSwitch = require('./automation_modules/sparkButtonToWemoSwitch.js').SparkButtonToWemoSwitch;
var TimedWemoSwitch = require('./automation_modules/timedWemoSwitch.js').TimedWemoSwitch;
var WemoControlPoint = require('./automation_modules/devices/wemo/wemoInit.js').cp; // needed to initialize the upnp module for WeMo support
var config = require('./config.js');

// Initializations
var spark = sparkInit.init(config.SPARK_USERNAME, config.SPARK_PASSWORD);

// Create and Link Scripts
var sparkButtonToSparkRGB1 = new SparkButtonToSparkRGB(spark, 1, 0);
var sparkButtonToWemoSwitch1 = new SparkButtonToWemoSwitch(WemoControlPoint, spark, 1, config.WEMO_SWITCH_NAME1);
var timedWemoSwitch1 = new TimedWemoSwitch(WemoControlPoint, config.WEMO_SWITCH_NAME1, 1000);
var timedWemoSwitch2 = new TimedWemoSwitch(WemoControlPoint, config.WEMO_SWITCH_NAME2, 1000);