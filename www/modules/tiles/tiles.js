"use strict";

angular.module('tiles', [])
.directive('tile', function() {
    return {
        restrict: "A",
        templateUrl: "modules/tiles/tile.html",
        scope: {
            tile: "=",
            x: "@",
            y: "@"
        }
    }
});