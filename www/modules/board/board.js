"use strict";

angular.module('board', [])
.controller('BoardCtrl', function($scope, TILESET, fiPlayers) {
    $scope.drawTileCard = function () {
        var i, drawCount, drawnTile, card;
        
        drawCount = Math.ceil($scope.waterLevel / 2) + 1
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
        fiPlayers.startGame(numPlayers);
        $scope.players = fiPlayers.playerList;
        $scope.currentPlayer = 1;
        $scope.waterLevel = 1;
        $scope.tiles = _.shuffle(TILESET);
        _.forEach($scope.tiles, function(t) {
            t.level = 0;
            _.forEach($scope.players, function(p) {
                if (t.start === p.id) {
                    t.token = "p" + p.id;
                }
            })
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