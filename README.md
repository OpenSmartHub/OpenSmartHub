# Open source Automated Smart Home

Home automation is a growing space and every device has it's own way to interact with it. This allows you combine them, make new ones and let your home handle itself based on your preferences automatically.

## What do I mean by that?
Imagine this you're sitting at home on your sofa and it gets way too warm due to the afternoon sun shining through your window. No need to get up, because your window begins to open by itself in order to cool it down. An hour later it starts to drizzle (a summer storm) but luckily your home hub knew that would happen and it closed your windows for you!

That's just one example of what the Home Hub could do for you. The great thing about it is that you can add any device to be automated through the hub! Imagine automating your home lighting, water heaters, sprinklers, etc. based on your movement, usage, time of day, and weather. Your regular home can now become a smart home!

## Why do I care?
If you don't plan on having a cool house (you don't). If you don't have other devices in your home like a Nest, WeMo, etc. (you don't yet)However! If you've got enough things on your mind and want to let your house handle itself, you definitely will care! Combine all your home devices under one hub that will rule them all.

## How does it work?
It uses Azure Websites, Azure WebJobs, WeatherUnderground API, Express, Node.js, and community driven automation components to give you a true automated smart home!.

# I want to use it!
Awesome! Here are the steps to set up your own private server hosted in the cloud!

1. Open an Azure account and create a free website (this will be the host for your home hub)
2. Feel free to add Authentication to this site before you add any content to it (that way only you and a select few can access your data)
2. Download this repo!
3. Open and edit run.js under the automation folder and pick and choose the functionality you want. For more info on how this is set up, scroll down to the Smart Home Modules section. (Note: You need the spark module in your root node_module directory in order to run spark code on the server!)
4. Rename public_config.js to config.js and replace it's contents with your configuration credentials.
5. Zip the "automation_module" folder, config.js, and run.js into one zip file and add it to the WebJobs on your Azure Website.

# Smart Home Modules
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