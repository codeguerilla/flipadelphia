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
            scope.$watch("tile.level", function(n) {
                element.addClass(levelClass[n]);
            })
        }
    }
});