'use strict';

angular.module('secretMsgOsmApp')
  .controller('MsgsCtrl', function ($scope, deviceready, MessagesService, $timeout, $q, $http, $rootScope, popupService, $upload) {
    $scope.message = '';
    $scope.signature = '';
    $scope.min_length = 2;
    $scope.max_length = 160;
    $scope.signature_max_length = 10;
    $scope.position = {
      lat: 51.505,
      lng: 13.0059
    };
    $scope.send = function(valid){
      if(valid) {
        $http.post("http://192.168.0.15:9000/messages.json", {
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

  $scope.uploadPhoto = function(imageURI) {
      var options = new FileUploadOptions();
      options.fileKey="image";
      options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
      options.mimeType="image/jpeg";

      var params = {};
      params.lat = $scope.position.lat;
      params.lng = $scope.position.lng;
      params.content = $scope.message.replace(/\n/g,"<br/>");
      params.signature = $scope.signature;

      options.params = params;

      var ft = new FileTransfer();
      ft.upload(imageURI, "http://192.168.0.15:9000/messages.json", $scope.win, $scope.fail, options);
  }

  $scope.win = function(r) {
      console.log("Code = " + r.responseCode);
      console.log("Response = " + r.response);
      console.log("Sent = " + r.bytesSent);
      popupService.alert("Message is successfully posted!");
      $rootScope.$broadcast('messageSent', {
          message: $scope.message,
          signature: $scope.signature
      });
  }

  $scope.fail = function(error) {
      alert("An error has occurred: Code = " + error.code);
      console.log("upload error source " + error.source);
      console.log("upload error target " + error.target);
      console.log("upload error " + JSON.stringify(error));
  }



  $scope.getPhoto = function() {
    deviceready().then(function () {
      navigator.camera.getPicture(
          $scope.uploadPhoto,
          function(message) { alert('get picture failed'); },
          {
              quality         : 50,
              destinationType : Camera.DestinationType.FILE_URI
          }
      );
    })
    
  }
  $scope.cancel = function(){
    $rootScope.$broadcast('cancelSendMessage');
  }

  $scope.$on('sendingPosition', function (event, data) {
    $scope.position.lat = data.lat;
    $scope.position.lng = data.lng;
  });

  });


