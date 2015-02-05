'use strict';

angular.module('secretMsgOsmApp')
  .controller('MsgsCtrl', function ($scope, MessagesService, $timeout, $q, $http, $rootScope, popupService) {
    $scope.message = '';
    $scope.signature = '';
    $scope.min_length = 2;
    $scope.max_length = 350;
    $scope.signature_max_length = 10;
    $scope.position = {
    	lat: 51.505,
        lng: 13.0059
    };
    $scope.send = function(valid){
      if(valid) {
        $http.post("http://secret-messages-osm.herokuapp.com/messages.json", {
          content: $scope.message.replace(/\n/g,"<br/>"),
          signature: $scope.signature,
          lat: $scope.position.lat,
          lng: $scope.position.lng
        }).success(function(data, code){
          if (code !== 201){
            popupService.alert(JSON.stringify(data.errors));
          }
          else {
            popupService.alert("Message is successfully posted!");
            $rootScope.$broadcast('messageSent', {
                message: $scope.message,
                signature: $scope.signature
            });
          }
        }).error(function(data, code){
          popupService.alert(JSON.stringify(data.errors));
      })
    }
    else {
    	popupService.alert("Data is not valid");
    }
  }
  $scope.cancel = function(){
  	$rootScope.$broadcast('cancelSendMessage');
  }

	$scope.$on('sendingPosition', function (event, data) {
		$scope.position.lat = data.lat;
		$scope.position.lng = data.lng;
	});

  });


