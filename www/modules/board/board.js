"use strict";

angular.module('board', [])
.controller('BoardCtrl', function($scope, TILESET, player) {
    $scope.drawTileCard = function () {
        var i, drawCount, drawnTile, card;
        
        drawCount = Math.ceil($scope.waterLevel / 2) + 1
        for (i = 0; i < drawCount; i++) {
            card = $scope.tileCards.deck.pop();
            
            drawnTile = _.find($scope.tiles, {"id": card});
            if (drawnTile.level === "tile-flooded") {
                drawnTile.level = "tile-lost";
            } else if (drawnTile.level !== "tile-lost") {
                drawnTile.level = "tile-flooded";
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
        $scope.players = player.startGame(numPlayers);
        $scope.waterLevel = 1;
        $scope.tiles = _.shuffle(TILESET);
        _.forEach($scope.tiles, function(t) {
            t.level = "";
            if (t.start === 1 && _.find($scope.players, {"id": 1})) {
                t.token = "p1";
            }
        });
        $scope.tileCards = {
            deck: _.shuffle(_.pluck(TILESET, "id")),
            discard: []
        };
    };
})
.directive('gameBoard', function() {
    return {
        restrict: "A",
        templateUrl: "modules/board/board.html",
        controller: "BoardCtrl"
    };
});