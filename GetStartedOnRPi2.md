#Get Started On Raspberry Pi 2

#Things You Will Need
* [Raspberry Pi 2](http://amzn.to/1JEdJ8n)
* At least a [16GB Class10 MicroSD Card](http://amzn.to/1L0Hpgg)
* HDMI cable and compatible Monitor for setup
* Network cable
* USB Keyboard and Mouse
* (Optional: [USB WiFi Dongle](http://amzn.to/1S3iKZz))
* (Optional: [Z-Wave Z-Stick Series 2 USB Dongle from Aeon Labs](http://amzn.to/1AByX3j))

#Steps
0. Download an Image of Raspbian for Raspberry Pi 2 [here](https://www.raspberrypi.org/downloads/)
0. Follow the instructions [here](https://www.raspberrypi.org/documentation/installation/installing-images/README.md) to install the image onto an SD card.
0. Now plug in the peripherals into your Raspberry Pi 2.
0. Plug in the power cable to your Raspberry Pi 2.
0. Once it loads, it will provide you with a blue screen and a bunch of options for your first time use.
  0. You will probably want to expand your filesystem (Press Enter next to that option)
  0. Internationalization Options.
    * Configuring locales (it is set to en_GB by default, but I switched mine to en_US.UTF8)
    * TimeZone (I switched mine to my location )
    * Keyboard Layout (This is the most annoying if you don't switch it. I made sure to switch it from the `Generic 105-key` to my `Logitech Generic Keyboard` with the Keyboard config set to English (US))
  0. After you have figured your configurations, select `Finish` and your Raspberry Pi 2 will reboot.
0. It will prompt you with the login screen. From this point, you should login with

        username: pi
        password: raspberry

0. Setup Auto Login:
  0. In Terminal:

          sudo nano /etc/inittab

  0. Scroll down to the line similar to:

          1:2345:respawn:/sbin/getty 115200 tty1

    and change to
    
          #1:2345:respawn:/sbin/getty 115200 tty1
    
    For me this line looks like: `1:2345:respawn:/sbin/getty --noclear 38400 ttty1`
  0. Under that line add:

          1:2345:respawn:/bin/login -f pi tty1 </dev/tty1 >/dev/tty1 2>&1
    
  0. Ctrl+X to exit, Y to save followed by enter.
0. Install Node.js on your Raspberry Pi 2 using these commands from the shell:

        wget http://nodejs.org/dist/v0.10.28/node-v0.10.28-linux-arm-pi.tar.gz
        tar -xvzf node-v0.10.28-linux-arm-pi.tar.gz
        node-v0.10.28-linux-arm-pi/bin/node --version

0. Now create a `~/.bash_profile` using the command `sudo nano ~/.bash_profile` and add the following lines into the file:

        NODE_JS_HOME=/home/pi/node-v0.10.28-linux-arm-pi 
        PATH=$PATH:$NODE_JS_HOME/bin

0. Reboot your Raspberry Pi 2 using the command:

        sudo reboot

0. Download the latest OpenSmartHub repository using the commands:

        git clone git://github.com/OpenSmartHub/OpenSmartHub.git

0. You will also want to run the following commands from the shell if you plan on using the Z-Wave Device code:

        sudo apt-get install subversion libudev-dev make build-essential python2.7 pkg-config libssl-dev

0. Change directories into `OpenSmartHub/local-hub` and run the install script which will install all the proper node modules. (This step can take a while because it needs to build some of these libraries)

        sh install.sh

0. Now you will want to customize the files inside it (Specifically the `local-hub\securityCredentials.js`)
0. Now set up your local-hub to run automatically after login.
  0. Open up a terminal session and create an auto_start.sh file

          nano auto_start.sh
    
  0. Add the following lines to it
  
          cd OpenSmartHub/local-hub
          ../../node-v0.10.28-linux-arm-pi/bin/node local-hub.js
  
  0. Edit the file /etc/profile
  
          sudo nano /etc/profile
  
  0. Add the following line to the end of the file
  
          . /home/pi/auto_start.sh
    replace the script name and path with correct name and path of your start-up script.
  0. Save and Exit (Press Ctrl+X to exit nano editor followed by Y to save the file.)

#Optional Add-Ons
0. If you plan to use Z-Wave devices in your home automation scenarios, you will need to buy a USB Z-Wave Adapter. I recommend the [Z-Wave Z-Stick Series 2 USB Dongle from Aeon Labs](http://amzn.to/1AByX3j)