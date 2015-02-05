'use strict';
angular.module('secretMsgOsmApp')
  .service('MessagesService', function MessagesService($http, MessagesContentService) {
    var getMarkers = function () {
      var markers = {};
      return markers;
    }

    return angular.extend(this, {
      getMarkers: function() {
        var markers = markers || {};
        return markers;
      }
    });
  });