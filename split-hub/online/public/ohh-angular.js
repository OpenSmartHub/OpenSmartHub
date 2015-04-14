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
          $scope.selectedScript = selectedScript;
        };

        // saving a new script
        $scope.createScript = function () {
          // TODO
          console.log($scope.storage);
          console.log("createScript Called");
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
          console.log($scope.storage.activeScripts.indexOf(script));
          var i = $scope.storage.activeScripts.indexOf(script);
          if(i != -1) {
            $scope.storage.activeScripts.splice(i, 1);
          }
          console.log($scope.storage);
          $scope.storage.$save();
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
  }]);
  angular
    .module('ohh')
      .controller('ActiveDevicesController', ['$scope', 'MyJsonService', function($scope, MyJsonService) {
        $scope.storage = MyJsonService.get();

        $scope.setDevice = function(selectedDevice){
          console.log("SetDevice Called");
          console.log(selectedDevice);
          $scope.selectedDevice = selectedDevice;
        };

        // saving a new devices
        $scope.createDevice = function () {
          // TODO
          console.log("createDevice Called");
        };

        // removing a script
        $scope.deleteDevice = function (device) {
          // TODO
          console.log("deleteDevice Called");
        };
  }]);
})();