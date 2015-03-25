var spark = require('spark');

exports.init = function(username, password)
{
  spark.login({username: username, password: password});
  return spark;
}
