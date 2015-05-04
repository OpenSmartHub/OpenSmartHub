(function () {
  angular
    .module('ohh', ['ngResource']);
  angular.module('ohh').factory('MyJsonService', ['$resource', function($resource) {
    return $resource('/storage');
  }]);
  angular
    .module('ohh')
      .controller('ActiveScriptContentController', ['$scope', 'MyJsonService', function($scope, MyJsonService) {
        $scope.storage = MyJsonService.get();
        $scope.newScenario = {};
        $scope.selectedTriggerDeviceTriggersLength = 0;
        $scope.selectedActionDeviceActionsLength = 0;

        $scope.setTriggerDevice = function(triggerDevice){
          console.log("setTriggerDevice Called");
          console.log(triggerDevice);

          $scope.selectedTriggerDevice = $scope.storage.yourDevices[triggerDevice];
          $scope.selectedTriggerDeviceType = $scope.storage.deviceTypes[$scope.selectedTriggerDevice.type];
          $scope.selectedTriggerDeviceTriggersLength = Object.keys($scope.selectedTriggerDeviceType.triggers).length;
        };

        $scope.setTriggerFunction = function(triggerFunction){
          console.log("setTriggerFunction Called");
          console.log(triggerFunction);

          $scope.selectedTriggerFunctionParams = $scope.selectedTriggerDeviceType.triggers[triggerFunction];
        };

        $scope.setActionDevice = function(actionDevice){
          console.log("setActionDevice Called");
          console.log(actionDevice);

          $scope.selectedActionDevice = $scope.storage.yourDevices[actionDevice];
          $scope.selectedActionDeviceType = $scope.storage.deviceTypes[$scope.selectedActionDevice.type];
          $scope.selectedActionDeviceActionsLength = Object.keys($scope.selectedActionDeviceType.actions).length;
          $scope.selectedActionFunctionParams = null;
        };

        $scope.setActionFunction = function(actionFunction){
          console.log("setActionFunction Called");
          console.log(actionFunction);

          $scope.selectedActionFunctionParams = $scope.selectedActionDeviceType.actions[actionFunction];
        };

        $scope.addAction = function(action){
          console.log("addAction");
          console.log(action);
          console.log($scope.newScenario);

          $scope.newScenario.actions = [];
          console.log($scope.newScenario.actions);
          $scope.newScenario.actions.push(action);
        };

        $scope.findDevicesMatching = function (param) {
          console.log("findDevicesMatching called");
          var matchingDevices = [];
          for (device in $scope.storage.activeDevices)
          {
            if ($scope.storage.activeDevices[device].type == param)
            {
              // console.log(device);
              // console.log("deviceType matched param");
              matchingDevices.push(device);
            }
          }
          // console.log(matchingDevices.length);
          return matchingDevices;
        };

        // saving a new script
        $scope.createScenario = function (newScenario) {
          console.log("createScenario");
          console.log(newScenario);

          // re-organize the params into an array instead of dictionary
          // var params = [];
          // for (var temp in newScenario.params)
          // {
          //   params.push(newScenario.params[temp]);
          // }
          // newScenario.params = params;

          $scope.storage.yourScenarios.push(newScenario);
          console.log($scope.storage.yourScenarios);
          $scope.storage.$save();
          $scope.newScenario = {};
        };

        // removing a script
        $scope.deleteScenario = function (scenario) {
          console.log("deleteScenario called");
          console.log(scenario);
          console.log($scope.storage.yourScenarios);
          
          // Find and remove item from an array
          $scope.storage.yourScenarios.splice(scenario, 1);

          $scope.storage.$save();
        };
  }]);
  angular
    .module('ohh')
      .controller('YourDevicesController', ['$scope', 'MyJsonService', function($scope, MyJsonService) {
        $scope.storage = MyJsonService.get();
        var newDevice = {};
        var newDeviceName = "";

        $scope.setDevice = function(selectedDevice){
          console.log("SetDevice Called");

          $scope.selectedDevice = $scope.storage.deviceTypes[selectedDevice];
        };

        // saving a new devices
        $scope.createDevice = function (newDeviceName, newDevice) {
          console.log(newDeviceName)
          console.log("newDevice");
          console.log(newDevice);

          console.log("createDevice Called");
          $scope.storage.yourDevices[newDeviceName] = newDevice;
          $scope.storage.$save();
          $scope.newDevice = {};
          $scope.newDeviceName = "";
        };

        // removing a script
        $scope.deleteDevice = function (device) {
          console.log("deleteDevice Called");
          deviceData = angular.copy(device);

          // Find and remove item from an array
          delete $scope.storage.yourDevices[device];

          // console.log($scope.storage.activeDevices.indexOf(device));
          // var i = $scope.storage.activeDevices.indexOf(device);
          // if(i != -1) {
          //   $scope.storage.activeDevices.splice(i, 1);
          // }
          console.log($scope.storage);
          $scope.storage.$save();
        };
  }]);
})();