'use strict';
var module = angular.module('secretMsgOsmApp', []);
module.directive('sap', function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div></div>',
        link: function(scope, element, attrs) {
            var map = L.map('map').setView([0, 0], 2);
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            L.Control.geocoder().addTo(map);
        }
    };
});