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

        $scope.setScript = function(selectedScript){
          console.log("SetScript Called");
          console.log(selectedScript);

          $scope.selectedScript = $scope.storage.scripts[selectedScript];
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
        $scope.createScript = function (newScriptName, newScript) {
          console.log("createScript");
          console.log(newScriptName);
          console.log(newScript);

          // re-organize the params into an array instead of dictionary
          var params = [];
          for (var temp in newScript.params)
          {
            params.push(newScript.params[temp]);
          }
          newScript.params = params;

          $scope.storage.activeScripts[newScriptName] = newScript;
          console.log($scope.storage.activeScripts);
          $scope.storage.$save();
        };

        // removing a script
        $scope.deleteScript = function (script) {
          scriptData = angular.copy(script); // strips the $$hashkey included by ng-repeat
          console.log("deleteScript called");
          console.log(script);
          console.log(scriptData);
          console.log($scope.storage);
          console.log($scope.storage.activeScripts);
          
          // Find and remove item from an array
          delete $scope.storage.activeScripts[script];

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