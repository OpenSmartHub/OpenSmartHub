echo "Running npm install in local folder"
npm install

echo "Renaming public_securityCredentials.js to securityCredentials.js"
rename public_securityCredentials.js securityCredentials.js

echo "Running npm install in wemo devices folder"
cd devices/wemo
npm install