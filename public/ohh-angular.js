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

        $scope.setTriggerDevice = function(triggerDevice){
          console.log("setTriggerDevice Called");
          console.log(triggerDevice);

          $scope.selectedTriggerDevice = $scope.storage.yourDevices[triggerDevice];
          $scope.selectedTriggerDeviceType = $scope.storage.deviceTypes[$scope.selectedTriggerDevice.type];
        };

        $scope.setTriggerFunction = function(triggerFunction){
          console.log("setTriggerFunction Called");
          console.log(triggerFunction);

          $scope.selectedTriggerFunctionParams = $scope.selectedTriggerDeviceType.triggers[triggerFunction];
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
          console.log("createScript");
          console.log(newScenario);

          // re-organize the params into an array instead of dictionary
          var params = [];
          for (var temp in newScenario.params)
          {
            params.push(newScenario.params[temp]);
          }
          newScenario.params = params;

          $scope.storage.yourScenarios.push(newScenario);
          console.log($scope.storage.yourScenarios);
          $scope.storage.$save();
        };

        // removing a script
        $scope.deleteScenario = function (scenario) {
          scenarioData = angular.copy(scenario); // strips the $$hashkey included by ng-repeat
          console.log("deleteScenario called");
          console.log(scenario);
          console.log(scenarioData);
          console.log($scope.storage);
          console.log($scope.storage.yourScenarios);
          
          // Find and remove item from an array
          delete $scope.storage.yourScenarios[scenario];

          //console.log($scope.storage.activeScripts.indexOf(script));
          //var i = $scope.storage.activeScripts.indexOf(script);
          // if(i != -1) {
          //   $scope.storage.activeScripts.splice(i, 1);
          // }

          console.log($scope.storage);
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