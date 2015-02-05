'use strict';

angular.module('secretMsgOsmApp')
  .service('MessagesContentService', function MessagesContentService($http, deviceready, $q) {
    // var self = this;
    function queryContentFromServer() {
      var message_defer = $q.defer();
      Authentication.authenticated().then(function () {
        $http.get('http://localhost:3000/game_contents.json')
        .success(function (data, status, headers, config) {
          console.log("MessagesContentService From Server achieved.")
          message_defer.resolve(data);
        })
          .error(function (data, status, headers, config) {
            console.log("[MessagesContentService] We got an error in loading.");
            message_defer.reject();
          });
      }, function (e) {
        log("MessagesContentService From Server not done because of Authentication.")
        message_defer.reject(e);
      });
      return message_defer.promise;
    }

    this.get = function (callb) {
      $http.get('http://localhost:3000/game_contents.json')
        .success(function (data, status, headers, config) {
          console.log("MessagesContentService From Server achieved.")
          message_defer.resolve(data);
        })
          .error(function (data, status, headers, config) {
            console.log("[MessagesContentService] We got an error in loading.");
            message_defer.reject();
          });
    }

    // Public method
    return this;

  });