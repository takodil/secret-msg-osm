angular.module('secretMsgOsmApp').factory('popupService',
  ["$timeout", "$q", "$compile", "$rootScope", "$log",
    function ($timeout, $q, $compile, $rootScope, $log) {

      var alert_default = {
        button: "OK"
      }

      var _alert = function (content, options) {
        var def = $q.defer();
        if (typeof(content) === "object") {
          options = content;
        }
        if (!options) options = {};
        options = angular.extend({}, {
          closeOnBackgroundClick: true
        }, options)

        var body = angular.element(document.querySelector('.content'));
        var scope = $rootScope.$new();


        scope._backgroundClick = function () {
          if (options.closeOnBackgroundClick === true) {
            scope._closePopup();
          }
        }
        var overlayElement = angular.element('<div class="popup-overlay" ng-click="_backgroundClick()"></div>');

        overlayElement = $compile(overlayElement)(scope, function (overlayElement, scope) {
          body.append(overlayElement);
        });

        scope._closePopup = function (event) {
          if (event && event.preventDefault)
            event.preventDefault();
          if (scope.close)
            scope.close(event)
          clonedElement.remove();
          overlayElement.remove();
          def.reject(event);
        };

        scope._ok = function (event) {
          if (event && event.preventDefault)
            event.preventDefault();
          clonedElement.remove();
          overlayElement.remove();
          if (scope.confirm) {
            scope.confirm(event);
          }
          def.resolve({event: event, scope: scope});
        }

        scope.init = function () {

        }


        var templateElement = angular.element('<div class="popup"></div>');
        templateElement.addClass(options.ui_class);
        if (!options || options.closeButton !== false)
          templateElement.append('<div class="button-cancel" type="button" ng-click="_closePopup()">');
        if (typeof(content) === "string") {
          templateElement.append('' + content + '</div>');
        }
        else if (options && options.templateUrl) {
          templateElement.append('<div ng-include="\'' + content.templateUrl + '\'"></div></div>');
          angular.extend(scope, content.scope);
        }
        else {
          $log.warn("PopupService called without content! Provide String or {templateUrl}");
        }


        var clonedElement = $compile(templateElement)(scope, function (clonedElement, scope) {
          body.append(clonedElement);
          // execute ok on all .confirm objects
          clonedElement.on('touchend click', '.confirm', scope._ok);
          // execute close on all .close objects
          clonedElement.on('touchend click', '.close', scope._closePopup);
          scope.init();
        });

        return def.promise;
      }


      var oldNotification = null;

      return {
        alert: _alert
      }
    }
  ])
;
