(function () {
  angular
    .module('ohh', ['ngResource']);
  angular.module('ohh').factory('MyJsonService', ['$resource', function($resource) {
    return $resource('/storage');
  }]);
  angular
    .module('ohh')
      .controller('ScriptController', ['$scope', 'MyJsonService', function($scope, MyJsonService) {
        $scope.storage = MyJsonService.get();
  }]);
  angular
    .module('ohh')
      .controller('ActiveScriptContentController', ['$scope', 'MyJsonService', function($scope, MyJsonService) {
        var activeScriptsController = this;
        activeScriptsController.activeScripts = activeScripts;
        $scope.storage = MyJsonService.get();

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
  }]);
  angular
    .module('ohh')
      .controller('ActiveDevicesController', ['$scope', function($scope) {
        var activeDevicesController = this;
        activeDevicesController.activeDevices = activeDevices;
        $.getJSON("save.json", function(data) { // gets the save file data
          $scope.storage = data;
          $scope.$apply(function(){ // this applies it to the page
            activeDevicesController.activeDevices = $scope.storage.activeDevices;
          });
        });

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