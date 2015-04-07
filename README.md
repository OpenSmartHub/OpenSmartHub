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

0. Open an Azure account and create a free website (this will be the host for your home hub)
0. In the configure tab, turn on websockets (the two components communicate through this)
0. Feel free to add Authentication to this site before you add any content to it (that way only you and a select few can access your data)
0. Download this repo!
0. Open and edit run.js under the automation folder and pick and choose the functionality you want. For more info on how this is set up, scroll down to the Smart Home Modules section. (Note: You need the spark module in your root node_module directory in order to run spark code on the server!)
0. Rename public_config.js to config.js and replace it's contents with your configuration credentials.
0. Zip the "automation_module" folder, config.js, and run.js into one zip file and add it to the WebJobs on your Azure Website. (If you want it to truly run continuously, you will need to upgrade your website from Shared or Free to Basic or Standard)

### Option 2: (Combined Hub)
Use any computer or micro-controller with node.js capabilities for a local network hub

1. Install Node.js
2. Download this repo!
3. Open and edit run.js under the automation folder and pick and choose the functionality you want. For more info on how this is set up, scroll down to the Smart Home Modules section.
4. Rename public_config.js to config.js and replace it's contents with your configuration credentials.
5. Run the command "node run.js"
6. To host the local network site run the command in another terminal "node server.js"

# Home Hub Modules
How the directories are set up:
* the "automation" folder is the root of all automation. (thus the name)
* the "automation_modules" folder is the home for all scripts and devices
* "scripts" are all the connection pieces between devices. They dictate an interaction.
* the "devices" folder is where all the folders for different devices are stored
* each device folder is where the configurations for devices are set up (sometimes devices can have different programs running on them and this is how they are separated)
Note: In the case of the buttonToLight script, Spark devices can publish events on the firmware side. These events can be subscribed to and used as triggers, so the sparkButton does not require a separate device js file.

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
