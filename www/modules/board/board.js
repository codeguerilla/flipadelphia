/*global angular, _*/
"use strict";

angular.module('board', [])
.controller('BoardCtrl', function($scope, TILESET, TREASURES, PHASE, fiGameUtils, fiTurns) {
    function setupTreasureDeck() {
        var i, deck = [];
        angular.forEach(TREASURES, function(card) {
            for (i = 0; i <= card.count; i++) {
                deck.push(card);
            }
        });
        $scope.treasureCards = {
            deck: _.shuffle(deck),
            discard: []
        };
    }
    
    function drawTreasureCards(player) {
        var i, card;
        for (i = 0; i < 2; i++) {
            if ($scope.treasureCards.deck.length === 0) {
                $scope.treasureCards.deck = _.shuffle($scope.treasureCards.discard);
                $scope.treasureCards.discard = [];
            }
            card = $scope.treasureCards.deck.pop();
            if (card.type === "WATERSRISE") {
                $scope.waterLevel++;
                resetTileCardDeck();
                $scope.treasureCards.discard.push(card);
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
    
    $scope.startGame = function (numPlayers) {
        fiGameUtils.initGame(numPlayers);
        $scope.players = fiGameUtils.allPlayers;
        $scope.waterLevel = 1;
        $scope.tiles = fiGameUtils.tiles;
        setupTreasureDeck();
        $scope.tileCards = {
            deck: _.shuffle(_.pluck(TILESET, "id")),
            discard: []
        };
    };
    
    $scope.$watch(function() { return fiTurns.getTurn().phase; }, function (turnPhase) {
        if (turnPhase === PHASE.TREASURE) {
            drawTreasureCards(fiGameUtils.currentPlayer());
            drawTileCards();
            fiGameUtils.gotoNextPlayer();
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
