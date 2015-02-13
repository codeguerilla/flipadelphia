/*global angular, _*/
"use strict";

angular.module('board', [])
.controller('BoardCtrl', function($scope, TILESET, fiGameUtils, fiTurns) {
    $scope.drawTileCards = function () {
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
    };
    
    //TODO : take this off $scope
    $scope.resetTileCardDeck = function () {
        var deck = $scope.tileCards.deck;
        deck.push.apply(deck, _.shuffle($scope.tileCards.discard));
        $scope.tileCards.discard = [];
    };
    
    $scope.startGame = function (numPlayers) {
        fiGameUtils.initGame(numPlayers);
        $scope.players = fiGameUtils.playerList;
        $scope.waterLevel = 1;
        $scope.tiles = fiGameUtils.tiles;
        $scope.tileCards = {
            deck: _.shuffle(_.pluck(TILESET, "id")),
            discard: []
        };
    };
    
    $scope.$watch(function() { return fiTurns.getTurn().phase; }, function (phase, old) {
        if (phase === 2 && phase !== old) {
            $scope.drawTileCards();
            fiGameUtils.gotoNextPlayer();
        }
    })
})
.directive('gameBoard', function() {
    return {
        restrict: "A",
        templateUrl: "modules/board/board.html",
        controller: "BoardCtrl"
    };
});
