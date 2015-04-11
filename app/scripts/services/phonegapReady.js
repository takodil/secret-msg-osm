(function () {
  'use strict';
  var readyPromise;
  var module = angular.module('secretMsgOsmApp');


  function runDesktop(isReady, deferred) {
    if (!isReady) {
      var device = {};
      device.desktop = true;
      device.ios = false;
      device.android = false;
      deferred.resolve(device);
    }
  }

  var register = function ($q, $window) {
    var deferred = $q.defer();
    var isReady = false;
    document.addEventListener('deviceready', function () {
      var device = window.device || {};
      device.desktop = false;
      device.ios = device.platform === 'iOS';
      device.android = device.platform === 'Android';
      isReady = true;
      deferred.resolve(device);
    });
    if ((!window.cordova && !window.Cordova) || !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
      runDesktop(isReady, deferred);
    }
    readyPromise = deferred.promise;
  };


  module.factory('deviceready', ['$q', '$window', function ($q, $window) {
    return function () {
      if (!readyPromise)
        register($q, $window);
      return readyPromise;
    };
  }]);
})();