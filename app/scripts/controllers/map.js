'use strict';
var app = angular.module('secretMsgOsmApp',['leaflet-directive']);

app.controller('mapCtrl', [ '$scope', 'leafletData', '$q', 'deviceready', '$window', function($scope, leafletData, $q, deviceready, $window) {
    angular.extend($scope, {
        center: {
            lat: 40.7127,
            lng: 74.0059,
            zoom: 10
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
                    $scope.center.lng = loc.lat();
                    //$scope.gotoLocation(loc.lat(), loc.lat());
                } else {
                    alert("Sorry, this search produced no results.");
                }
            });
        }
    };


    //$scope.geoCode = function() {
        // var map = L.map('map').setView([0, 0], 2);
        // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        // }).addTo(map);
        // L.Control.geocoder().addTo(map);
        // return true;
        // var map = L.map('map').setView([0, 0], 2),
        //     geocoder = L.Control.Geocoder.nominatim(),
        //     control = L.Control.geocoder({
        //         geocoder: geocoder
        //     }).addTo(map),
        //     marker;
        // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        // }).addTo(map);
        // map.on('click', function(e) {
        //     geocoder.reverse(e.latlng, map.options.crs.scale(map.getZoom()), function(results) {
        //         var r = results[0];
        //         if (r) {
        //             if (marker) {
        //                 marker.
        //                     setLatLng(r.center).
        //                     setPopupContent(r.html || r.name).
        //                     openPopup();
        //             } else {
        //                 marker = L.marker(r.center).bindPopup(r.name).addTo(map).openPopup();
        //             }
        //         }
        //     })
        // })
        // deviceready().then(function () {
        //      navigator.geocoder.geocodeString(
        //         function onSuccess(coords) {
        //             alert("The location is lat="+coords.latitude+", lon="+coords.longitude);
        //         }, 
        //         function onError(err) {
        //             alert(JSON.stringify(err));
        //         }, 
        //         "55418");           
        // })

    //}
}]
);