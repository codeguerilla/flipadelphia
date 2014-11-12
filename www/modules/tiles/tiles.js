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
        },
        link: function(scope, element) {
            var levelClass = {
                "0": "safe",
                "1": "flooded",
                "2": "sunk"
            }
            scope.$watch("tile", function(n, o) {
                if (n && !o) {
                    scope.tile.xVal = scope.x;
                    scope.tile.yVal = scope.y;
                }
            }, true);
            scope.$watch("tile.level", function(n, o) {
                element.removeClass(levelClass[o]);
                element.addClass(levelClass[n]);
            })
        }
    }
});