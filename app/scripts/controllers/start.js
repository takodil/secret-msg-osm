'use strict';

angular.module('secretMsgOsmApp')
  .service('Ready', function Ready($q) {
    var def = $q.defer();
    return {
      fire: function () {
        def.resolve();
      },
      ready: function () {
        return def.promise;
      }
    }
  })
  .controller('StartCtrl', function (Ready, $q, $timeout, $scope, deviceready, $log, $rootScope, $http) {

    $rootScope.$on("app-ready", function () {
      $scope.startApp();
    });

    $scope.startApp = function () {
      console.log("START APP");
      $timeout(function () {
        Ready.fire();
      });
    };
  }
)
;
