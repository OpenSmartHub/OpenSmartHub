var OpenZWave = require('openzwave');
var securityCredentials = require('./securityCredentials.js');
var fs = require('fs');

var zwaveController = new OpenZWave(securityCredentials.ZSTICK_USBPORT, {
	saveconfig: true,
});

var nodes = [];
var zwaveDevices = {};
var data = {};
data.deviceTypes = {};
data.yourDevices = {};

zwaveController.on('driver ready', function(homeid) {
	console.log('scanning homeid=0x%s...', homeid.toString(16));
});

zwaveController.on('driver failed', function() {
	console.log('failed to start driver');
	zwaveController.disconnect();
	process.exit();
});

zwaveController.on('node added', function(nodeid) {
	nodes[nodeid] = {
		manufacturer: '',
		manufacturerid: '',
		product: '',
		producttype: '',
		productid: '',
		type: '',
		name: '',
		loc: '',
		classes: {},
		ready: false,
	};
});

zwaveController.on('value added', function(nodeid, comclass, value) {
	if (!nodes[nodeid]['classes'][comclass])
		nodes[nodeid]['classes'][comclass] = {};
	nodes[nodeid]['classes'][comclass][value.index] = value;
});

zwaveController.on('value changed', function(nodeid, comclass, value) {
	if (nodes[nodeid]['ready']) {
		console.log('node%d: changed: %d:%s:%s->%s', nodeid, comclass,
			    value['label'],
			    nodes[nodeid]['classes'][comclass][value.index]['value'],
			    value['value']);
	}
	nodes[nodeid]['classes'][comclass][value.index] = value;
});

zwaveController.on('value removed', function(nodeid, comclass, index) {
	if (nodes[nodeid]['classes'][comclass] &&
	    nodes[nodeid]['classes'][comclass][index])
		delete nodes[nodeid]['classes'][comclass][index];
});

zwaveController.on('node ready', function(nodeid, nodeinfo) {
	nodes[nodeid]['manufacturer'] = nodeinfo.manufacturer;
	nodes[nodeid]['manufacturerid'] = nodeinfo.manufacturerid;
	nodes[nodeid]['product'] = nodeinfo.product;
	nodes[nodeid]['producttype'] = nodeinfo.producttype;
	nodes[nodeid]['productid'] = nodeinfo.productid;
	nodes[nodeid]['type'] = nodeinfo.type;
	nodes[nodeid]['name'] = nodeinfo.name;
	nodes[nodeid]['loc'] = nodeinfo.loc;
	nodes[nodeid]['ready'] = true;
	console.log('node%d: %s, %s', nodeid,
		    nodeinfo.manufacturer ? nodeinfo.manufacturer
					  : 'id=' + nodeinfo.manufacturerid,
		    nodeinfo.product ? nodeinfo.product
				     : 'product=' + nodeinfo.productid +
				       ', type=' + nodeinfo.producttype);
	console.log('node%d: name="%s", type="%s", location="%s"', nodeid,
		    nodeinfo.name,
		    nodeinfo.type,
		    nodeinfo.loc);
	for (comclass in nodes[nodeid]['classes']) {
		switch (comclass) {
		case 0x25: // COMMAND_CLASS_SWITCH_BINARY
		case 0x26: // COMMAND_CLASS_SWITCH_MULTILEVEL
		case 0x30: // COMMAND_CLASS_SENSOR_MULTILEVEL
		case 0x31: // COMMAND_CLASS_SENSOR_BINARY
			zwaveController.enablePoll(nodeid, comclass);
			break;
		}
		var values = nodes[nodeid]['classes'][comclass];
		console.log('node%d: class %d', nodeid, comclass);
		for (idx in values)
			console.log('node%d:   %s=%s', nodeid, values[idx]['label'], values[idx]['value']);
	}

	AddNodeIntoConfig(nodes[nodeid], nodeid);
});

zwaveController.on('notification', function(nodeid, notif) {
	switch (notif) {
	case 0:
		console.log('node%d: message complete', nodeid);
		break;
	case 1:
		console.log('node%d: timeout', nodeid);
		break;
	case 2:
		console.log('node%d: nop', nodeid);
		break;
	case 3:
		console.log('node%d: node awake', nodeid);
		break;
	case 4:
		console.log('node%d: node sleep', nodeid);
		break;
	case 5:
		console.log('node%d: node dead', nodeid);
		break;
	case 6:
		console.log('node%d: node alive', nodeid);
		break;
        }
});

zwaveController.on('scan complete', function() {
	console.log('scan complete, hit ^C to finish.');
	//ConvertToConfigCompatibleJson(nodes);
	// fs.writeFile('./zwaveDeviceConfig.json', JSON.stringify(data), function (err) {
	//     if (err) throw err;
	//     console.log('It\'s saved!');
	// });
});

var ConvertToConfigCompatibleJson = function(n){
	for (entry in n)
	{
		AddNodeIntoConfig(n[entry], entry);
	}
}

var AddNodeIntoConfig = function(node, id){
	if(node != null &&
		 node["type"] != "Static PC Controller" &&
		 node.manufacturerid != "" &&
		 node.productid != "")
		{
			var openzwaveDevice = node;
			var deviceType = {};
			var deviceName = "ZWave-";
			if(openzwaveDevice.manufacturer)
			{
				deviceName += openzwaveDevice.manufacturer;
			}else{
				var temp = 'id=' + openzwaveDevice.manufacturerid;
				deviceName += temp;
			}

			if(openzwaveDevice.product)
			{
				deviceName += openzwaveDevice.product;
			}else{
				var temp = 'product=' + openzwaveDevice.productid + ', type=' + openzwaveDevice.producttype;
				deviceName += temp;
			}

			deviceType.params = ["nodeid"];
			deviceType.data = {};
			deviceType.triggers = {};
			deviceType.actions = {};

			// read classes and create the schema
			if (node["classes"][0x25.toString()] != null)// 37 is Binary Switch
			{
				// bool is true when on, false when off
				deviceType.data["switchState"] = "on/off"
				deviceType.triggers["switchToggledTrigger"] = ["on/off/both"];
            	deviceType.actions["switchToggle"] =  ["on/off/both"];
            	deviceType.actions["switchTimedToggle"] = [ "on/off/both", "milliseconds" ];
			}
			else if(node["classes"][0x31.toString()] != null) // 49 is SensorMultilevel for Temperature, Luminance, and Relative Humidity
			{
				// This device is the Multi-Sensor
				deviceType.data["temperature"] = "int";
				deviceType.data["luminance"] = "int";
				deviceType.data["humidity"] = "int";
			}
			else if(node["classes"][0x30.toString()] != null) // 48 is SensorBinary
			{
				// 
				deviceType.data["sensorState"] = "closed/open"
				deviceType.triggers["sensorToggledTrigger"] = ["closed/open/both"];
			}
			else if(node["classes"][0x80.toString()] != null) // 128 is Battery powered devices
			{
				deviceType.data["batterylevel"] = "int"
			} 

			var device = {
				"type":deviceName,
				"params":{
					"nodeid":id.toString()
				}
			};
			data["deviceTypes"][deviceName] = deviceType;
			data["yourDevices"][deviceName + " Node: " + id.toString()] = device;
		}
	fs.writeFile('./zwaveDeviceConfig.json', JSON.stringify(data), function (err) {
	    if (err) throw err;
	    console.log('It\'s saved!');
	});
}

zwaveController.connect();

process.on('SIGINT', function() {
	console.log('disconnecting...');
	zwaveController.disconnect();
	process.exit();
});