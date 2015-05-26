#I want to use it!

Awesome! Here are the steps to get started.
There are three main components:
* Online-hub : this web component will act as the UI to handle configurations easily on the fly. (I host mine in Azure)
* Local-hub : A device hosts the local-hub and will act as the brain for the whole automation hub. This portion lives in your home and is always running.
* Your devices : these are the components that will interact through the hub.

##Setup the Online-Hub
0. If you have a way of creating and hosting a Node.js website established already, skip steps 2 and 3.
0. If not, create an Azure account if you don't have one already, they offer a [free trial](http://azure.microsoft.com/en-us/pricing/free-trial/)
0. Create a new website that will act as the `online-hub`.
  * In Azure, you will want to create a new Web App with a url that you can remember
0. To use the online-hub straight out of the box, create a [new Github application](https://github.com/settings/applications/new). Take note of the `Client ID` and `Client Secret` you will need this for later.
  * You will need to enter the newly created website url as the `Homepage URL`.
  * You will need to enter the newly created website url with an appended `/auth/github/callback` as the `Authorization callback URL`
  * If you do not have a Github account, please [sign up for one](https://github.com/join).
0. You can now FTP into the server hosting your new website.
0. On your development machine, download the online-hub folder.
0. Rename `public_securityCredentials.js` to `securityCredentials.js` and update it's contents with your own information
  * Enter the Github `Client ID` and `Client Secret` from earlier.
  * Add your github username in the allowed users and a custom secret. If you want to add more than one, add another user.
  * Add a custom session secret that is used by the online-hub to save session data.
  * Add your website's url instead of `http://YOUR_AZURE_WEBSITE.azurewebsites.net` for the CALLBACK_URL.
0. Using FTP, place the contents of the online-hub folder in the `wwwroot` of your website server.
0. Your website should now be operational!
0. Feel free to customize the login page to your own design whims.

##Setup the Local-Hub
0. Install Nodejs on your local-hub machine
0. Place the local-hub folder on the machine
0. Open up a terminal or command line window
0. If you are on a Mac or Linux machine run `sh installScript.sh`, if you are on a PC run `installScript.bat`. This will install the node modules needed in all the right places and rename `public_securityCredentials.js` to `securityCredentials.js`.
0. Update `securityCredentials.js` with your own information
  * The contents of this file are used to connect to the various services / devices.
  * The required portion needs to match one of the users that you put in the online-hub `securityCredentials.js`. This setting allows only your local-hub to connect to the online-hub.
  * The optional portions are for connecting to devices/services
0. Run the local-hub.js program using `node local-hub.js`
0. Your local-hub is now setup!
0. If you ever want to update the local-hub with the latest possible devices, the easiest way will be to copy and replace the files (don't delete since that will remove your securityCredentials javascript file.

##Use It
0. Go to a browser and enter your website's url
0. Login using the authentication method of your choice. (I used Github)
0. Add scenarios or devices using the buttons on the website.
0. Any changes you make will automatically be sent to your local-hub!

##If you want to contribute to our device library or add your own devices, learn more in the [Device Creation Guidelines](DeviceCreationGuidelines.md)

###[Go Back](README.md)