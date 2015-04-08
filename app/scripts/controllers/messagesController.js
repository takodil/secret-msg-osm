'use strict';

angular.module('secretMsgOsmApp')
  .controller('MsgsCtrl', function ($scope, deviceready, MessagesService, $timeout, $q, $http, $rootScope, popupService) {
    $scope.message = '';
    $scope.signature = '';
    $scope.min_length = 2;
    $scope.max_length = 160;
    $scope.signature_max_length = 10;
    $scope.position = {
      lat: 51.505,
      lng: 13.0059
    }
    $scope.photoExists = false;
    $scope.imageSRC = "http://secret-messages-osm.herokuapp.com/images/missing.png";
    $scope.send = function(valid){
      console.log($scope.photoExists);
      if(valid) {
        if($scope.photoExists){
          $scope.uploadPhoto($scope.imageSRC);
        }
        else{
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
              $scope.message = '';
              $scope.signature = '';
              $scope.imageSRC = "http://secret-messages-osm.herokuapp.com/images/missing.png";
              $rootScope.$broadcast('messageSent', {
                  message: $scope.message,
                  signature: $scope.signature
              });
            }
          }).error(function(data, code){
            popupService.alert(JSON.stringify(data.errors));
        })
      }
    }
    else {
      popupService.alert("Data is not valid");
    }
  }

  $scope.uploadPhoto = function(imageSRC) {
      var options = new FileUploadOptions();
      options.fileKey="image";
      options.fileName=imageSRC.substr(imageSRC.lastIndexOf('/')+1);
      options.mimeType="image/jpeg";

      var params = {};
      params.lat = $scope.position.lat;
      params.lng = $scope.position.lng;
      params.content = $scope.message.replace(/\n/g,"<br/>");
      params.signature = $scope.signature;

      options.params = params;

      var ft = new FileTransfer();
      ft.upload(imageSRC, "http://secret-messages-osm.herokuapp.com/messages.json", $scope.win, $scope.fail, options);
  }

  $scope.win = function(r) {
      console.log("Code = " + r.responseCode);
      console.log("Response = " + r.response);
      console.log("Sent = " + r.bytesSent);
      popupService.alert("Message is successfully posted!");
      $scope.message = '';
      $scope.signature = '';
      $scope.imageSRC = "http://secret-messages-osm.herokuapp.com/images/missing.png";
      $rootScope.$broadcast('messageSent', {
          message: $scope.message,
          signature: $scope.signature
      });
  }

  $scope.fail = function(error) {
      alert("An error has occurred: Code = " + error.code);
      console.log("upload error source " + error.source);
      console.log("upload error target " + error.target);
  }



  $scope.getPhoto = function() {
    deviceready().then(function () {
      navigator.camera.getPicture(
          $scope.setPhotoExists,
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
    $scope.message = '';
    $scope.signature = '';
    $scope.imageSRC = "http://secret-messages-osm.herokuapp.com/images/missing.png";
  }
  $scope.setPhotoExists = function(imageURI) {
    $scope.photoExists = true;
    $scope.imageSRC = imageURI;
  }

  $scope.$on('sendingPosition', function (event, data) {
    $scope.position.lat = data.lat;
    $scope.position.lng = data.lng;
  });

  });


