"use strict";

angular.module('tiles', [])
.directive('tile', function() {
    return {
        restrict: "A",
        templateUrl: "modules/tiles/tile.html",
        scope: {
            tile: "=",
            x: "@",
            y: "@",
            p: "="
        },
        link: function(scope, element) {
            var levelClass = {
                "0": "safe",
                "1": "flooded",
                "2": "sunk"
            }
            
            scope.canMove = function() {
                var result = false;
                if (scope.p) {
                    if (scope.p.currentTile.xVal === scope.x && Math.abs(scope.p.currentTile.yVal - scope.y) === 1) { result = true; }
                    if (scope.p.currentTile.yVal === scope.y && Math.abs(scope.p.currentTile.xVal - scope.x) === 1) { result = true; } 
                }
                return result;
            }
            
            scope.moveHere = function() {
                alert("moving");
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