/*global angular, _*/
"use strict";

angular.module('board', [])
.directive('gameBoard', function() {
    return {
        restrict: "E",
        templateUrl: "modules/board/board.html",
        scope: {
            tiles: "="
        }
    };
});
