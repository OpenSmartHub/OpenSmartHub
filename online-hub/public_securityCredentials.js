// Github Application Details
exports.GITHUB_CLIENT_ID = "__insert_github_client_id_here__"
exports.GITHUB_CLIENT_SECRET = "__insert_github_client_secret_here__";

// Used to keep the session information secret for passport.io
exports.SESSION_SECRET = "__insert_custom_secret_here__";
exports.CALLBACK_URL = "http://YOUR_AZURE_WEBSITE.azurewebsites.net/auth/github/callback";

// Details for the clients that are allowed to connect
exports.allowedUsers = [
  {'username':'__insert_your_github_username_here__', 'secret':'__insert_another_custom_secret_here__'}
  // CUSTOM: add more users if you want multiple people to have access
];