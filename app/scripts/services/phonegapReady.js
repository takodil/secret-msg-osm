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
    var deferred = $q.defer(),
      isReady = false;

      deferred.resolve();
    angular.element($window.document).bind('deviceready', function () {
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
    // Removed the timeout to support older phones which are slow.
    
    /*setTimeout(function () {
      runDesktop(isReady, deferred);
    }, 5000);*/
    readyPromise = deferred.promise;
  };


  module.factory('deviceready', ['$q', '$window', function ($q, $window) {
    return function () {
      if (!readyPromise)
        register($q, $window);
      return readyPromise;
    };
  }]);


  module.factory('phonegapReady', ['deviceready', function (deviceready) {
    return function (fn) {
      var queue = [];
      var impl = function () {
        queue.push(Array.prototype.slice.call(arguments));
      };

      deviceready().then(function () {
        queue.forEach(function (args) {
          fn.apply(this, args);
        });
        impl = fn;
      });

      return function () {
        return impl.apply(this, arguments);
      };
    };
  }]);
})();