Z-Wave Devices have certain classes associated with them in order to provide generic funcitonalities.
For the usage of them in scenarios, they need to be slightly more defined.
Because of this, I have created a couple basic Z-Wave Device Implementations, but feel free to add more.
Find more info on the classes by looking at the files inside the OpenZWave Command Classes folder: [https://github.com/jperkin/node-openzwave/tree/master/deps/open-zwave/cpp/src/command_classes](https://github.com/jperkin/node-openzwave/tree/master/deps/open-zwave/cpp/src/command_classes)

Here are the classes I have mapped out:

 Hexidecimal Representation of Class #  | Decimal Representation |      Name      | Description
0x25 | 37  | Binary Switch | Binary Switch with a boolean for power
0x30 | 48  | SensorBinary | Binary Sensor with a boolean for true/false
0x31 | 49  | SensorMultilevel | Sensor for Temperature, Luminance, and Relative Humidity
0x80 | 128 | Battery | Battery powered devices
0x71 | 113 | Alarm |

The "ZWave-" prefix declares that it is in fact a zwave device.

Here is the process for setting up your devices:
1. Run the `ZWaveDeviceConverter.js`. This will create a `zwaveDeviceConfig.json` file that you can copy and paste part of it's contents into the config.json. (Future implementations will hopefully replace and input the zwave devices directly into your config file)
2. While the ZWaveDeviceConverter is running, make sure to also wake any battery powered devices by pressing the z-wave button on them once before exiting the application.
