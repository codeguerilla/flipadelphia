"use strict";

angular.module('board', [])
.controller('BoardCtrl', function($scope, TILESET) {
    $scope.waterLevel = 1;
    $scope.tiles = TILESET;
    $scope.tileCards = {
        deck: _.shuffle(_.pluck(TILESET, "id")),
        discard: []
    }

    $scope.shuffleTiles = function () {
        $scope.tiles = _.shuffle(TILESET);
    }
    
    $scope.drawTileCard = function () {
        var i, drawCount, drawnTile, card;
        
        drawCount = Math.ceil($scope.waterLevel / 2) + 1
        for (i = 0; i < drawCount; i++) {
            card = $scope.tileCards.deck.pop();
            $scope.tileCards.discard.push(card);
            
            drawnTile = _.find($scope.tiles, {"id": card});
            if (drawnTile.level === "tile-flooded") {
                drawnTile.level = "tile-lost";
            } else if (drawnTile.level !== "tile-lost") {
                drawnTile.level = "tile-flooded";
            }
        }
    }
    
    //TODO : take this off $scope
    $scope.resetTileCardDeck = function () {
        var deck = $scope.tileCards.deck;
        deck.push.apply(deck, _.shuffle($scope.tileCards.discard));
        $scope.tileCards.discard = [];
    }
})
.directive('gameBoard', function() {
    return {
        restrict: "A",
        templateUrl: "modules/board/board.html",
        controller: "BoardCtrl"
    };
});