'use strict';
var app = angular.module('secretMsgOsmApp',['leaflet-directive']);

app.controller('mapCtrl', [ '$scope', 'leafletData', '$q', 'deviceready', '$window', function($scope, leafletData, $q, deviceready, $window) {
    angular.extend($scope, {
        center: {
            lat: 40.7127,
            lng: 74.0059,
            zoom: 20
        }
    });
    
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
            // navigator.geolocation.getCurrentPosition(
            //   function (args) {
            //     console.log("xxx");
            //     console.log(args.coords.latitude);
            //     // $scope.onSuccess = {
            //     //   lastLocation.lat: parseFloat(args.coords.latitude),
            //     //   lastLocation.lng: parseFloat(args.coords.longitude),
            //     //   time: args.timestamp
            //     // };
            //   }, function (e) {
            //     console.log("Low accurate watch position did not work. Error: " + e.message);
            //     defered.notify(options);
            //   }, {
            //     timeout: 10000,
            //     maximumAge: 10000
            //   });
        });
    };
}]
);