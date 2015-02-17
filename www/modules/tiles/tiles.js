/*global angular, _*/
"use strict";

angular.module('tiles', [])
.directive('tile', function(PHASE, fiGameUtils, fiTurns, fiSwim, $q) {
    return {
        restrict: "A",
        require: "^gameBoard",
        templateUrl: "modules/tiles/tile.html",
        scope: {
            tile: "=",
            x: "@",
            y: "@"
        },
        link: function(scope, element, attrs, boardCtrl) {
            var levelClass = {
                    "0": "safe",
                    "1": "flooded",
                    "2": "sunk"
                },
                swim = {
                    defers: [],
                    promises: [],
                    counter: 0
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
            
            function onTile() {
                return fiGameUtils.currentPlayer().tile === scope.tile;
            }
            
            function isFlooded(level) {
                return level > 1;
            }
            
            function isPhase(p) {
                return fiTurns.getTurn().phase === p;
            }
            
            function moveToShore() {
                var sunkPlayers = fiGameUtils.playersOnTile(scope.tile.id),
                    swimPromises,
                    saveCurrentPlayerId;
                if (sunkPlayers.length > 0) {
                    fiTurns.getTurn().phase = PHASE.SWIM;
                    swimPromises = fiSwim.start(sunkPlayers);
                    saveCurrentPlayerId = fiGameUtils.currentPlayer().id;
                    
                    fiGameUtils.gotoPlayer(fiSwim.players[0].id);
                    angular.forEach(swimPromises, function(p) {
                        p.then(function() {
                            if (fiSwim.counter < fiSwim.players.length) {
                                fiGameUtils.gotoPlayer(fiSwim.players[fiSwim.counter].id);
                            }
                        });
                    });
                    $q.all(swimPromises).then(function() {
                        fiTurns.getTurn().phase = PHASE.ACTION;
                        fiGameUtils.gotoPlayer(saveCurrentPlayerId);
                    });
                }
                
            }
            
            scope.canMoveHere = function() {
                return (isPhase(PHASE.ACTION) || isPhase(PHASE.SWIM)) && isAdjacent() && !isFlooded(scope.tile.level);
            };
            
            scope.moveHere = function() {
                if (scope.canMoveHere()) {
                    var pToken = "p" + fiGameUtils.currentPlayer().id;
                    fiGameUtils.currentPlayer().tile.tokens.pop(pToken);
                    fiGameUtils.currentPlayer().tile = scope.tile;
                    fiGameUtils.currentPlayer().tile.tokens.push(pToken);
                    if (isPhase(PHASE.ACTION)) {
                        fiTurns.addAction();
                    } else if (isPhase(PHASE.SWIM)) {
                        fiSwim.toShore();
                    }
                }
            };
            
            scope.canShoreUp = function() {
                return isPhase(PHASE.ACTION) && scope.tile && scope.tile.level === 1 && (isAdjacent() || onTile());
            };
            
            scope.shoreUp = function() {
                if (scope.canShoreUp()) {
                    scope.tile.level = 0;
                    fiTurns.addAction();
                }
            };
            
            scope.canTakeRelic = function() {
                return onTile() && _.where(fiGameUtils.currentPlayer().cards, { "type": "RELIC", "value": scope.tile.relic }).length >= 4;
            };
            
            scope.takeRelic = function() {
                var playerCards = fiGameUtils.currentPlayer().cards,
                    relicCard = { "type": "RELIC", "value": scope.tile.relic };
                fiGameUtils.currentPlayer().cards = _.reject(playerCards, relicCard);
                boardCtrl.discard(_.filter(playerCards, relicCard));
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
                    moveToShore();
                }
            });
        }
    };
})
.service("fiSwim", function($q) {
    var that = this,
        defers = [],
        promises = [],
        counter = 0;
        
    this.players = [];
    
    this.start = function(sunkPlayers) {
        defers = [];
        promises = [];
        counter = 0;
        that.players = sunkPlayers;
        for(var i = 0; i < sunkPlayers.length; i++) {
            var d = $q.defer();
            defers.push(d);
            promises.push(d.promise);
        }
        return promises;
    };
    
    this.toShore = function() {
        defers[counter].resolve();
        counter++;
    };
});
