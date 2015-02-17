/*global angular, _*/
"use strict";

angular.module('cards', [])
.directive('treasureCard', function() {
    return {
        restrict: "E",
        templateUrl: "modules/cards/card.html",
        scope: {
            card: "="
        }
    };
});
