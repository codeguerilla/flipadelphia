"use strict";

angular.module('tiles', [])
.directive('tile', function(fiTurns) {
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
            
            scope.canMove = function() {
                var result = false,
                    p = fiTurns.currentPlayer;
                if (p && p.currentTile) {
                    if (p.currentTile.xVal === scope.x && Math.abs(p.currentTile.yVal - scope.y) === 1) { result = true; }
                    if (p.currentTile.yVal === scope.y && Math.abs(p.currentTile.xVal - scope.x) === 1) { result = true; } 
                }
                return result;
            }
            
            scope.moveHere = function() {
                alert("moving");
            }
            
            scope.$watch("tile.id", function(n, o) {
                if (n !== o) {
                    scope.tile.xVal = scope.x;
                    scope.tile.yVal = scope.y;
                }
            });
            scope.$watch("tile.level", function(n, o) {
                element.removeClass(levelClass[o]);
                element.addClass(levelClass[n]);
            })
        }
    }
});