'use strict';
var app = angular.module('secretMsgOsmApp',['leaflet-directive', 'ngTouch', 'angularFileUpload']);

app.controller('mapCtrl', [ '$scope', 'leafletData', '$q', 'deviceready', '$window', 'MessagesService', '$http', 'popupService', '$rootScope', function($scope, leafletData, $q, deviceready, $window, MessagesService, $http, popupService, $rootScope) {
    angular.extend($scope, {
        center: {
            lat: 51.505,
            lng: 13.0059,
            zoom: 15
        },
        data: {markers: {}},
        events: {}
    });
    $scope.messagesData = "";
    $scope.postMessageValue = false;
    $scope.getCurrentLocation = function() {
        deviceready().then(function () {
            navigator.geolocation.getCurrentPosition(
            function (args) {
                $scope.center.lat = args.coords.latitude;
                $scope.center.lng = args.coords.longitude;
            }
        , function (e) {
        console.log("Low accurate watch position did not work. Error: " + e.message);
        }, {
            timeout: 10000,
            maximumAge: 10000
        });
        });
    };
    // geo-coding
    $scope.search = "";
    $scope.geoCode = function () {
        if ($scope.search && $scope.search.length > 0) {
            if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
            this.geocoder.geocode({ 'address': $scope.search }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var loc = results[0].geometry.location;
                    $scope.search = results[0].formatted_address;
                    $scope.center.lat = loc.lat();
                    $scope.center.lng = loc.lng();
                } else {
                    alert("Sorry, this search produced no results.");
                }
            });
        }
    };
    $scope.markers = new Array();
    $scope.addMarkers = function() {
        $scope.data.markers = {};
        $http.get('http://192.168.0.15:9000//messages.json')
        .success(function (data, status, headers, config) {
            console.log("MessagesContentService From Server achieved.");
            $scope.messagesData = data;
            for (var i = 0; i < data.length; i++) {
                var html = "<img class='image-marker' src='"+$scope.messagesData[i]["image_url"]+"' id='myimg' />";
                $scope.markers.push({
                    lat: $scope.messagesData[i]["lat"],
                    lng: $scope.messagesData[i]["lng"],
                    message: html+$scope.messagesData[i]["content"] + '<br/>Written by: ' + $scope.messagesData[i]["signature"]
                });
            }
        
        })
        .error(function (data, status, headers, config) {
            console.log("[MessagesContentService] We got an error in loading."+JSON.stringify(config)+data );
            
        });
        angular.extend($scope.data, { angularInterpolatedMessage : "Angular interpolated message!"});
    };
    $scope.removeMarkers = function() {
        $scope.data.markers = {};
    }
    $scope.addMarkers();

    

    $scope.$on("leafletDirectiveMap.click", function(event, args){
        var leafEvent = args.leafletEvent;
        // popupService.alert("test");
        popupService.alert({
          templateUrl: 'views/alert.html'
        }).then(function () {
            $scope.postMessageValue = true;
            $scope.markers.push({
                lat: leafEvent.latlng.lat,
                lng: leafEvent.latlng.lng,
                message: "Add new message here"
            });
            $scope.$broadcast('sendingPosition', {
                lat: leafEvent.latlng.lat,
                lng: leafEvent.latlng.lng
            });
        });
        
    });
    $scope.$on('cancelSendMessage', function() {
        $scope.markers.pop();
        $scope.postMessageValue = false;
    });  
    $scope.$on('messageSent', function(event, data) {
        $scope.postMessageValue = false;
        $scope.data.markers = {};
        $scope.addMarkers();
    }); 

}]
);