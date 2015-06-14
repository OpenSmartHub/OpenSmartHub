#Version History
###v0.0.3
* Changed from the previous naming of ohh to OpenSmartHub
* Added step-by-step instructions for putting the local-hub on Raspberry Pi 2
* Added an Action interface and custom button interface for causing changes immediately.
* Fixed the online-hub's mobile UI to scale properly
* Removed the need for customNames for triggers in the UI (all created on the backend)
* Added Yamaha Receivers to possible devices
* Added Z-Wave Devices to possible devices
* Added transfer config file mechanism between online-hub and local-hub
* Added install scripts
* Fixed Wemo devices not being found initially error

###v0.0.2
* Added data field to devices
* Added authentication to the server and the socket connection
* Created dispose function in devices to clean them up on local-hub resets
* Added Device Creation Guidelines
* Added WeatherUndergroundAPI skeleton
* Added NewDeviceExample
* Added Scenario structure
* Added Clock Device
* Finished the re-implementation of the hub
* Added the basics of the online-hub and local-hub interaction