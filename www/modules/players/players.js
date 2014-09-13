"use strict";

angular.module('players', [])
.factory('player', function () {
    var p = {
        currentTile: {},
        cards: []
    };
    
    return {
        startGame: function(numPlayers) {
            var i,
                newPlayer,
                playerList = [];
            for (i = 0; i <= numPlayers; i++) {
                newPlayer = angular.copy(p);
                newPlayer.id = i;
                playerList.push(newPlayer);
            }
            return playerList;
        }
    };
});