#Azure Setup Instructions
0. If you have a way of creating and hosting a Node.js website established already, skip steps 2 and 3.
0. If not, create an Azure account if you don't have one already, they offer a [free trial](http://azure.microsoft.com/en-us/pricing/free-trial/)
0. Create a new website that will act as the `online-hub`.
  * In Azure, you will want to create a new Web App with a url that you can remember
0. To use the online-hub straight out of the box, create a [new Github application](https://github.com/settings/applications/new). Take note of the `Client ID` and `Client Secret` you will need this for later.
  * You will need to enter the newly created website url as the `Homepage URL`.
  * You will need to enter the newly created website url with an appended `/auth/github/callback` as the `Authorization callback URL`
  * If you do not have a Github account, please [sign up for one](https://github.com/join).
0. On your development machine, download the online-hub folder.
0. Rename `public_securityCredentials.js` to `securityCredentials.js` and update it's contents with your own information
  * Enter the Github `Client ID` and `Client Secret` from earlier.
  * Add your github username in the allowed users and a custom secret. If you want to add more than one, add another user.
  * Add a custom session secret that is used by the online-hub to save session data.
  * Add your website's url instead of `http://YOUR_AZURE_WEBSITE.azurewebsites.net` for the CALLBACK_URL.
0. Access the Kudu console at `{yoursite}.scm.azurewebsites.net` and click on Debug Console -> CMD at the top.
(The Kudu Console is a tool that gives you both command line and file browser access to your sites, all from the comfort of a web browser. To find out more, go to: [https://github.com/projectkudu/kudu/wiki/Kudu-console](https://github.com/projectkudu/kudu/wiki/Kudu-console))
  * This will open up both a browser page with both a console window as well as a file explorer.
  * Change directories into the wwwroot folder by typing `cd site\wwwroot` into the command window.
  * Next, zip the online-hub and drag and drop it into the browser where it should automatically unzip ![](kudu-zipdemonstration.gif)
  * Next you will want to run `npm install` from within the command window.
0. Your website should now be operational!
0. Feel free to customize the login page to your own design whims.