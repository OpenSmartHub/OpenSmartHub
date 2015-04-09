(function () {
  angular
    .module('ohh', [])
      .controller('ActiveScriptContentController', function() {
        var activeScriptsController = this;
        activeScriptsController.activeScripts = [
          {name:'SparkButtonToSparkRGB', description:"hello"},
          {name:'SparkButtonToWeMoLamp', description:"hello2"}];
  });
  angular
    .module('ohh')
      .controller('ActiveDevicesController', function () {
        var activeDevicesController = this;
        activeDevicesController.activeDevices = [
          {name:'SparkButton', description:"hello"},
          {name:'SparkRGB', description:"hello2"},
          {name:'WeMoLamp', description:"hello3"}];
  });
})();