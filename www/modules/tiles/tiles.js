/*global angular, _*/
"use strict";

angular.module('tiles', [])
.directive('tile', function(PHASE, fiPlayers, fiTurns, fiSwim, $q, treasureDeck) {
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
                };
            
            function isAdjacent() {
                var result = false,
                    p = fiPlayers.currentPlayer();
                if (p && p.tile) {
                    if (p.tile.xVal === scope.x && Math.abs(p.tile.yVal - scope.y) === 1) { result = true; }
                    if (p.tile.yVal === scope.y && Math.abs(p.tile.xVal - scope.x) === 1) { result = true; } 
                }
                return result;
            }
            
            function onTile() {
                return fiPlayers.currentPlayer().tile === scope.tile;
            }
            
            function isFlooded(level) {
                return level > 1;
            }
            
            function isPhase(p) {
                return fiTurns.turn.phase === p;
            }
            
            function moveToShore() {
                var sunkPlayers = fiPlayers.playersOnTile(scope.tile.id),
                    swimPromises,
                    saveCurrentPlayerId;
                if (sunkPlayers.length > 0) {
                    fiTurns.turn.phase = PHASE.SWIM;
                    swimPromises = fiSwim.start(sunkPlayers);
                    saveCurrentPlayerId = fiPlayers.currentPlayer().id;
                    
                    fiPlayers.gotoPlayer(fiSwim.players[0].id);
                    angular.forEach(swimPromises, function(p) {
                        p.then(function() {
                            if (fiSwim.counter < fiSwim.players.length) {
                                fiPlayers.gotoPlayer(fiSwim.players[fiSwim.counter].id);
                            }
                        });
                    });
                    $q.all(swimPromises).then(function() {
                        fiTurns.turn.phase = PHASE.ACTION;
                        fiPlayers.gotoPlayer(saveCurrentPlayerId);
                    });
                }
                
            }
            
            scope.canMoveHere = function() {
                return (isPhase(PHASE.ACTION) || isPhase(PHASE.SWIM)) && isAdjacent() && !isFlooded(scope.tile.level);
            };
            
            scope.moveHere = function() {
                if (scope.canMoveHere()) {
                    var pToken = "p" + fiPlayers.currentPlayer().id;
                    fiPlayers.currentPlayer().tile.tokens.pop(pToken);
                    fiPlayers.currentPlayer().tile = scope.tile;
                    fiPlayers.currentPlayer().tile.tokens.push(pToken);
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
                return isPhase(PHASE.ACTION) && onTile() && _.where(fiPlayers.currentPlayer().cards, { "type": "RELIC", "value": scope.tile.relic }).length >= 4;
            };
            
            scope.takeRelic = function() {
                var playerCards = fiPlayers.currentPlayer().cards,
                    relicCard = { "type": "RELIC", "value": scope.tile.relic };
                fiPlayers.takeRelic(scope.tile.relic);
                fiPlayers.currentPlayer().cards = _.reject(playerCards, relicCard);
                treasureDeck.discard(_.filter(playerCards, relicCard));
                fiTurns.addAction();
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
