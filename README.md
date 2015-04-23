# Open source Home Hub

### Currently Supported Devices:
* Spark maker projects (Button, Motion, RGB Strip)
* WeMo (if the hub is run on a local network)
* WeatherUnderground APIs for local astronomical and weather forecasts

### Near Future:
* WeMo (through the cloud hub)
* Any device that can make a HTTP POST call
* Any device hooked up to IFTTT

Want to see a device supported? Comment below!

# One hub to rule them all!

Home automation is a growing space and every device has it's own way to interact with it. This allows you combine them, make new ones and let your home handle itself based on your preferences automatically.

Imagine this you're sitting at home on your sofa and it gets way too warm due to the afternoon sun shining through your window. No need to get up, because your window begins to open by itself in order to cool it down. An hour later it starts to drizzle (a summer storm) but luckily your home hub knew that would happen and it closed your windows for you!

That's just one example of what the Home Hub could do for you. The great thing about it is that you can add any device to be automated through the hub! Imagine automating your home lighting, water heaters, sprinklers, etc. based on your movement, usage, time of day, and weather. Your regular home can now become a smart home!

## How does it work?
It uses Azure Websites, Azure WebJobs, WeatherUnderground API, Express, Node.js, and community driven automation components to give you a true automated smart home! (You can also run it locally on a Node.js capable machine within your home network)

# I want to use it!
Awesome! Here are the steps to set up your own private server hosted in the cloud!

### Option 1: (Split Hub)
Use Azure for a website and home hub that you can access from anywhere with a local component to communicate with locally connected devices.

0. Open an Azure account and create a free website (this will be the host for your online-hub)
0. In the configure tab, turn on WebSockets (the two components communicate through this) and make sure it is set to `Always On`.
0. Feel free to add Authentication to this site before you add any content to it (that way only you and a select few can access your data)
0. Download this repo!
0. Rename public_config.js to config.js and replace it's contents with your configuration credentials.
0. npm install (in the `local` folder and in the `local/automation_modules/devices/wemo` folder)

# Home Hub Modules

### Config File contains:

  **Device Type Library** - [Dictionary]

    Device Type - [Object]
      * Name of type - [String]
      * Array of Parameter Types for creation - (Array of strings in order with int-, double-, bool-, etc. prefixed)
      * Triggers - [Dictionary]
        * Trigger -> {name:"",params:[]}
      * Actions - [Dictionary]
        * Action -> {name:"",params:[]}

  **Your Devices** - [Dictionary]

    Device - [Object]
      * Name your device - [String]
      * Device Type - [String] -> Links to an entry in the Device Type Library
      * Array of parameters for creation of device (in order) - [Array of strings of values]

  **Your Scenarios** - [Dictionary]

    Scenario - [Object]
      * Name of scenario - [String]
      * Trigger - [A single Trigger structure](Future: multiple triggers together)
        * Trigger: {description: "ScenarioTriggerDescription", device: "deviceName", trigger:"triggerName", customTrigger:"customTriggerName" params:[]}
      * List of Actions to perform - [Array of Action structures]
        * Action: {description:"ScenarioActionDescription", device: "deviceName", action: "actionName", params:[]}

### The result of the creation process using the config file above:
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
    

# The Future
* **Community Growth! The more people that automate devices based on the hub and come up with recipes, the more robust the functionality will be!**
* Tie into nest api as a device or get their temperature settings. And wemo or smart things to integrate into their systems.
* App that will automatically turn on security mode when you are away.
* Get data from multiple spark cores like temperature in your house or motion and toggle multiple devices based off of spark too.
* Touch LCD for toggling on a hub device in your home.

# How is it different?
There are other open source automation projects but can you easily use it, alter it, and add more functionality? **The key to the Open source Home Hub is that it is designed to be simple. Easily follow step by step directions to get it set up and contribute! No need to read pages and pages of documentation to get started!**

Note:
The wemo devices folder is a submodule based off of [Stormboy's node-upnp-controlpoint](https://github.com/stormboy/node-upnp-controlpoint)
