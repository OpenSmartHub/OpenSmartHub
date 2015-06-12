(function () {
  angular
    .module('ohh', ['ngResource']);
  angular.module('ohh').factory('MyJsonService', ['$resource', function($resource) {
    return $resource('/config');
  }]);
  angular.module('ohh').factory('ConnectionStatus', ['$resource', function($resource){
    return $resource('/connection_status');
  }]);
  angular
    .module('ohh')
      .controller('ConfigurationContentController', ['$scope', 'ConnectionStatus', 'MyJsonService', function($scope, ConnectionStatus, MyJsonService){
        $scope.triggerDevices = {};
        $scope.actionDevices = {};
        var checkDevices = function(result){
          // console.log("checkDevices called");
          // console.log("result:")
          // console.log(result);
          $scope.triggerDevices = {};
          $scope.actionDevices = {};
          for(deviceName in result.yourDevices)
          {
            var device = result.yourDevices[deviceName];
            var deviceType = result.deviceTypes[device.type];
            // console.log("info: ");
            // console.log(deviceName);
            // console.log(Object.keys(deviceType.triggers).length);
            // console.log(Object.keys(deviceType.actions).length);
            if(Object.keys(deviceType.triggers).length > 0)
            {
              $scope.triggerDevices[deviceName] = device;
            }

            if(Object.keys(deviceType.actions).length > 0)
            {
              $scope.actionDevices[deviceName] = device;
            }
          }
          // console.log("triggerDevices");
          // console.log($scope.triggerDevices);
          // console.log("actionDevices");
          // console.log($scope.actionDevices);
        };

        $scope.connectionStatus = ConnectionStatus.get();
        $scope.storage = MyJsonService.get(checkDevices);

        $scope.newScenario = {};
        $scope.selectedTriggerDeviceTriggersLength = 0;
        $scope.selectedActionDeviceActionsLength = 0;
        $scope.newScenario.actions = [];
        var newAction = {};
        var newDevice = {};
        var newDeviceName = "";

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

          console.log($scope.newScenario.actions);
          $scope.newScenario.actions.push(action);
          $scope.newAction = {};
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

          var d = new Date();
          newScenario.trigger.customTrigger = d.getTime();

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
          checkDevices();
        };

        // removing a script
        $scope.deleteDevice = function (device) {
          console.log("deleteDevice Called");
          deviceData = angular.copy(device);

          // Find and remove item from a dictionary
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
  angular
    .module('ohh')
      .controller('DashboardContentController', ['$scope', 'ConnectionStatus', 'MyJsonService', '$http', function($scope, ConnectionStatus, MyJsonService, $http){
        $scope.triggerDevices = {};
        $scope.actionDevices = {};
        var checkDevices = function(result){
          // console.log("checkDevices called");
          // console.log("result:")
          // console.log(result);
          $scope.triggerDevices = {};
          $scope.actionDevices = {};
          for(deviceName in result.yourDevices)
          {
            var device = result.yourDevices[deviceName];
            var deviceType = result.deviceTypes[device.type];
            // console.log("info: ");
            // console.log(deviceName);
            // console.log(Object.keys(deviceType.triggers).length);
            // console.log(Object.keys(deviceType.actions).length);
            if(Object.keys(deviceType.triggers).length > 0)
            {
              $scope.triggerDevices[deviceName] = device;
            }

            if(Object.keys(deviceType.actions).length > 0)
            {
              $scope.actionDevices[deviceName] = device;
            }
          }
          // console.log("triggerDevices");
          // console.log($scope.triggerDevices);
          // console.log("actionDevices");
          // console.log($scope.actionDevices);
        };

        $scope.connectionStatus = ConnectionStatus.get();
        $scope.storage = MyJsonService.get(checkDevices);

        $scope.newButtonScenario = [];
        $scope.newButtonScenarioName = "";
        $scope.selectedActionDeviceName = "";
        $scope.selectedTriggerDeviceTriggersLength = 0;
        $scope.selectedActionDeviceActionsLength = 0;
        $scope.newAction = {};
        $scope.newAction.params = {};

        $scope.setActionDevice = function(actionDevice){
          console.log("setActionDevice Called");
          console.log(actionDevice);

          $scope.selectedActionDeviceName = actionDevice;
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
          console.log($scope.newButtonScenario);

          console.log($scope.newButtonScenario.actions);
          $scope.newButtonScenario.push(action);
          $scope.newAction = {};
          $scope.newAction.params = {};
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
        $scope.createButton = function (newButtonScenario, newButtonScenarioName) {
          console.log("createButton");
          console.log(newButtonScenario);

          $scope.storage.yourButtons[newButtonScenarioName] = newButtonScenario;
          console.log($scope.storage.yourButtons);
          $scope.storage.$save();
          $scope.newButtonScenario = [];
          $scope.newButtonScenarioName = "";
        };

        // removing a script
        $scope.deleteButton = function (buttonScenario) {
          console.log("deleteButton called");
          console.log(buttonScenario);
          console.log($scope.storage.yourButtons);
          
          // Find and remove item from an array
          delete $scope.storage.yourButtons[buttonScenario];

          $scope.storage.$save();
        };

        $scope.callAction = function (action){
          action.device = $scope.selectedActionDeviceName;
          console.log("callAction called");
          console.log(action);
          var id = ""
          var temp = [];
          temp.push(action);
          $http.post('/api/buttons', {buttonId:id, button:temp}).
            success(function(data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              console.log('post request worked!');
            }).
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              console.log('post request failed!');
          });
        };

        $scope.callButton = function (id){
          console.log("id");
          console.log(id);

          $http.post('/api/buttons', {buttonId:id, button:$scope.storage.yourButtons[id]}).
            success(function(data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              console.log('post request worked!');
            }).
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              console.log('post request failed!');
          });
        };
  }]);
})();