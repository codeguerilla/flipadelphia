/*global angular, _*/
"use strict";

angular.module('board', ['gameUtils.treasureDeck', 'gameUtils.tileDeck'])
.controller('BoardCtrl', function($scope, TILESET, PHASE, fiPlayers, fiTurns, treasureDeck, tileDeck) {
    function setupBoard() {
        $scope.tiles = _.shuffle(TILESET);
        angular.forEach($scope.tiles, function(t) {
            t.level = 0;
            t.tokens = [];
            angular.forEach(fiPlayers.playerList, function(p) {
                if (t === p.tile) {
                    t.tokens.push("p" + p.id);
                }
            });
        });
    }
    
    function drawTreasureCards(player) {
        var i, card;
        for (i = 0; i < 2; i++) {
            card = treasureDeck.draw();
            if (card.type === "WATERSRISE") {
                $scope.waterLevel++;
                tileDeck.reset();
                treasureDeck.discard(card);
            } else {
                player.cards.push(card);
            }
        }
    }
  
    function drawTileCards (drawCount) {
        var i, drawnTile, card;
        
        for (i = 0; i < drawCount; i++) {
            card = tileDeck.draw();
            drawnTile = _.find($scope.tiles, {"id": card});
            drawnTile.level = drawnTile.level + 1;
            if (drawnTile.level < 2) {
                tileDeck.discard(card);
            }
        }
    }
    
    $scope.treasureCount = treasureDeck.getCount;
    $scope.currentPlayer = function() {
        return fiPlayers.currentPlayer().id;
    };
    $scope.playerClass = function() {
        return "player" + fiPlayers.currentPlayer().id;
    };
    
    this.discard = function(cards) {
        $scope.treasureCards.discard.push(cards);
    };
    
    $scope.startGame = function (numPlayers) {
        fiPlayers.initGame(numPlayers);
        $scope.players = fiPlayers.playerList;
        setupBoard();
        $scope.waterLevel = 1;
        treasureDeck.setup();
        tileDeck.setup();
        drawTileCards(6);
    };
    
    $scope.$watch(function() { return fiTurns.turn.phase; }, function (turnPhase) {
        if (turnPhase === PHASE.TREASURE) {
            drawTreasureCards(fiPlayers.currentPlayer());
            drawTileCards(Math.ceil($scope.waterLevel / 2) + 1);
            fiPlayers.gotoNextPlayer();
        }
    });
})
.directive('gameBoard', function() {
    return {
        restrict: "A",
        templateUrl: "modules/board/board.html",
        controller: "BoardCtrl"
    };
});
