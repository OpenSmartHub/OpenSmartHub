#Open source Home Hub

* [Introduction](#one-hub-to-rule-them-all)
* [How It Works](#how-it-works)
* [Get Started Using It](GetStartedUsing.md)
* [Supported Devices](#supported-devices)
* [Device Creation Guidelines](DeviceCreationGuidelines.md)
* [Gritty Details](#gritty-details)
* [Version History](VersionHistory.md)
* [Links to Supporting Modules](#links-to-supporting-modules)

##One hub to rule them all

Home automation is a growing space and every device has it's own way to interact with it. This allows you combine them, make new ones and let your home handle itself based on your preferences automatically.

Imagine this you're sitting at home on your sofa and it gets way too warm due to the afternoon sun shining through your window. No need to get up, because your window begins to open by itself in order to cool it down. An hour later it starts to drizzle (a summer storm) but luckily your home hub knew that would happen and it closed your windows for you!

That's just one example of what the Home Hub could do for you. The great thing about it is that you can add any device to be automated through the hub! Imagine automating your home lighting, water heaters, sprinklers, etc. based on your movement, usage, time of day, and weather. Your regular home can now become a smart home!

##How it works
It uses Azure Websites, a local hub device (can be anything that runs Node.js), any of your smarthome or self-made devices, and WeatherUnderground API.

####The Azure Website:
* This will act as a cloud based UI that can be accessed from anywhere given the right authentication credentials.
* It is built using Node.js, Express, and Socket.io to provide a simple UI. None of which needs to be fiddled with just to use it.
* This portion is optional and can also be run from the Local Hub Device if you don't care about access when outside your home network.

####Local Hub Device
* Can be an old PC, Raspberry Pi, or Intel Edison. (Just needs to be able to run a Node.js application)
* This will need to always stay on in order to interact with your devices and the cloud. (Which is why I suggest a small footprint machine like the Raspberry Pi)

####Devices
* These are your smart home devices. They can be anything from a NEST thermostat, WeMo switches, SmartThings devices, or even your own self-made projects.

###How is it different?
There are other open source automation projects but **the key to the Open source Home Hub is that it is designed to be simple yet you can control every part! Easily follow step by step directions to get it set up and contribute!**

##[Get Started Using It](GetStartedUsing.md)

##Supported Devices

###Currently Supported Devices:
  * Spark maker projects (Button, Motion, RGB Strip)
  * WeMo
  * WeatherUnderground APIs for local astronomical and weather forecasts
  * Clock for time related triggers and data
  * Z-Wave Devices (With a [USB Z-Wave Adapter](http://amzn.to/1AByX3j))
  * Yamaha Receivers

###Near Future:
  * Amazon Echo

Want to see a device supported? You have the power to add it yourself!

##[Device Creation Guidelines](DeviceCreationGuidelines.md)

##Gritty Details

###Config File contains:

  **Device Type Library** - [Dictionary]
    
    Name of type - [String]
    Device Type - [Object]
      * Array of Parameter Types for creation - (Array of strings in order with int-, double-, bool-, etc. prefixed)
      * Data - [Dictionary]
        * Data -> {"name":"type"}
      * Triggers - [Dictionary]
        * Trigger -> {"name":[params]}
      * Actions - [Dictionary]
        * Action -> {"name":[params]}

  **Your Devices** - [Dictionary]
  
    Name your device - [String]
    Device - [Object]
      * Device Type - [String] -> Links to an entry in the Device Type Library
      * Dictionary of parameters for creation of device (keys match the param types in the DeviceType)

  **Your Scenarios** - [Array]

    Scenario - [Object]
      * Description of Scenario - [String]
      * Trigger - [A single Trigger structure](Future: multiple triggers together)
        * Trigger: {device: "deviceName", trigger:"triggerName", customTrigger:"customTriggerName" params:{}}
      * List of Actions to perform - [Array of Action structures]
        * Action: {device: "deviceName", action: "actionName", params:{}}

###The result of the creation process using the config file above:
  **Running Devices:** Dictionary of your devices

    * Custom name for device - [String]
    * Device - [Object] created using the details from the config file
      * Dictionary of actions
        * name: "actionName", action: var representation of action
      * Dictionary of triggers
        * name: "triggerName"

  **Running Scenarios:** Dictionary of your scenarios

    * Custom name for scenario - [String]
    * ID -> created from device.on("event") trigger function {
            builds the actions at runtime by looking at the config for the list of actions, the device and function (maps the device function), and the parameters
        }

Triggers can be made using a on("event") with a check inside (if statement that emits an event of special-naming when it is valid)

##[Version History](VersionHistory.md)

##Links to Supporting Modules

* The wemo devices folder is a submodule based off of [Stormboy's node-upnp-controlpoint](https://github.com/stormboy/node-upnp-controlpoint)
* Some of the icons in the Web UI come from [Free icons by Icons8](https://icons8.com/)
