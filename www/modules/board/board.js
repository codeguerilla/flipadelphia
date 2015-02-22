/*global angular, _*/
"use strict";

angular.module('board', ['gameUtils.treasureDeck'])
.controller('BoardCtrl', function($scope, TILESET, PHASE, fiPlayers, fiTurns, treasureDeck) {
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
                resetTileCardDeck();
                treasureDeck.discard(card);
            } else {
                player.cards.push(card);
            }
        }
    }
  
    function drawTileCards () {
        var i, drawCount, drawnTile, card;
        
        drawCount = Math.ceil($scope.waterLevel / 2) + 1;
        for (i = 0; i < drawCount; i++) {
            card = $scope.tileCards.deck.pop();
            drawnTile = _.find($scope.tiles, {"id": card});
            drawnTile.level = drawnTile.level + 1;
            if (drawnTile.level < 2) {
                $scope.tileCards.discard.push(card);
            }
        }
    }
    
    function resetTileCardDeck() {
        var deck = $scope.tileCards.deck;
        deck.push.apply(deck, _.shuffle($scope.tileCards.discard));
        $scope.tileCards.discard = [];
    }
    
    this.discard = function(cards) {
        $scope.treasureCards.discard.push(cards);
    };
    
    $scope.startGame = function (numPlayers) {
        fiPlayers.initGame(numPlayers);
        $scope.players = fiPlayers.playerList;
        setupBoard();
        $scope.waterLevel = 1;
        treasureDeck.setup();
        $scope.treasureCount = treasureDeck.getCount;
        $scope.tileCards = {
            deck: _.shuffle(_.pluck(TILESET, "id")),
            discard: []
        };
    };
    
    $scope.$watch(function() { return fiTurns.turn.phase; }, function (turnPhase) {
        if (turnPhase === PHASE.TREASURE) {
            drawTreasureCards(fiPlayers.currentPlayer());
            drawTileCards();
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
