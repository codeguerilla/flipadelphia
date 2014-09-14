"use strict";

angular.module('players', [])
.factory('fiPlayers', function () {
    var p = {
        currentTile: {},
        cards: []
    },
    playerList = [];
    
    return {
        playerList: playerList,
        startGame: function(numPlayers) {
            var i,
                newPlayer;
            for (i = 0; i <= numPlayers; i++) {
                newPlayer = angular.copy(p);
                newPlayer.id = i;
                playerList.push(newPlayer);
            };
        }
    };
});