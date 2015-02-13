/*global angular, _*/
"use strict";

angular.module('board', [])
.controller('BoardCtrl', function($scope, TILESET, TREASURES, PHASE, fiGameUtils, fiTurns) {
    var waterLevel,
        treasureCards = {},
        tileCards = {};
        
    function setupTreasureDeck() {
        var i, deck = [];
        angular.forEach(TREASURES, function(card) {
            for (i = 0; i <= card.count; i++) {
                deck.push(card);
            }
        });
        treasureCards = {
            deck: _.shuffle(deck),
            discard: []
        };
        console.log(treasureCards);
    }
  
    function drawTileCards () {
        var i, drawCount, drawnTile, card;
        
        drawCount = Math.ceil(waterLevel / 2) + 1;
        for (i = 0; i < drawCount; i++) {
            card = tileCards.deck.pop();
            drawnTile = _.find($scope.tiles, {"id": card});
            drawnTile.level = drawnTile.level + 1;
            if (drawnTile.level < 2) {
                tileCards.discard.push(card);
            }
        }
    }
    
    function resetTileCardDeck() {
        var deck = tileCards.deck;
        deck.push.apply(deck, _.shuffle(tileCards.discard));
        tileCards.discard = [];
    }
    
    function watersRise() {
        waterLevel++;
        resetTileCardDeck();
    }
    
    $scope.startGame = function (numPlayers) {
        fiGameUtils.initGame(numPlayers);
        $scope.players = fiGameUtils.playerList;
        waterLevel = 1;
        $scope.tiles = fiGameUtils.tiles;
        setupTreasureDeck();
        tileCards = {
            deck: _.shuffle(_.pluck(TILESET, "id")),
            discard: []
        };
    };
    
    $scope.$watch(function() { return fiTurns.getTurn().phase; }, function (turnPhase) {
        if (turnPhase === PHASE.FLOOD) {
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
