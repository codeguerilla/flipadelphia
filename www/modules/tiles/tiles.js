/*global angular, _*/
"use strict";

angular.module('tiles', [])
.directive('tile', function(PHASE, fiGameUtils, fiTurns) {
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
                };
            
            function isAdjacent() {
                var result = false,
                    p = fiGameUtils.currentPlayer();
                if (p && p.tile) {
                    if (p.tile.xVal === scope.x && Math.abs(p.tile.yVal - scope.y) === 1) { result = true; }
                    if (p.tile.yVal === scope.y && Math.abs(p.tile.xVal - scope.x) === 1) { result = true; } 
                }
                return result;
            }
            
            function isFlooded(level) {
                return level > 1;
            }
            
            function isActionPhase() {
                return fiTurns.getTurn().phase === PHASE.ACTION;
            }
            
            function moveToShore(player) {
                var saveCurrentPlayer = fiGameUtils.currentPlayer();
                //TODO: Give player options to move to shore, disable other game controls
            }
            
            scope.canMoveHere = function() {
                return isActionPhase() && isAdjacent() && !isFlooded(scope.tile.level);
            };
            
            scope.moveHere = function() {
                if (scope.canMoveHere()) {
                    var pToken = "p" + fiGameUtils.currentPlayer().id;
                    fiGameUtils.currentPlayer().tile.tokens.pop(pToken);
                    fiGameUtils.currentPlayer().tile = scope.tile;
                    fiGameUtils.currentPlayer().tile.tokens.push(pToken);
                    fiTurns.addAction();
                }
            };
            
            scope.canShoreUp = function() {
                return isActionPhase() && scope.tile && scope.tile.level === 1 && isAdjacent();
            };
            
            scope.shoreUp = function() {
                if (scope.canShoreUp()) {
                    scope.tile.level = 0;
                    fiTurns.addAction();
                }
            };
            
            scope.$watch("tile.id", function(n, o) {
                if (n !== o) {
                    scope.tile.xVal = scope.x;
                    scope.tile.yVal = scope.y;
                }
            });
            scope.$watch("tile.level", function(n, o) {
                element.removeClass(levelClass[o]);
                element.addClass(levelClass[n]);
                
                if (n && isFlooded(n)) {
                    var sunkPlayers = fiGameUtils.playersOnTile(scope.tile.id);
                    angular.forEach(sunkPlayers, function(player) {
                        moveToShore(player);
                    });
                }
            });
        }
    };
});