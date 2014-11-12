"use strict";

angular.module('gameUtils', [])
.factory('fiPlayers', function () {
    var p = {
        currentTile: {},
        cards: []
    },
    playerList = [];
    
    return {
        playerList: playerList,
        initPlayerList: function(numPlayers) {
            var i,
                newPlayer;
            for (i = 1; i <= numPlayers; i++) {
                newPlayer = angular.copy(p);
                newPlayer.id = i;
                playerList.push(newPlayer);
            };
        }
    };
})
.factory('fiTurns', function () {
    var turn = {},
        currentPlayer;
    
    return {
        turn: turn,
        currentPlayer: currentPlayer,
        resetTurn: function(playerId) {
            turn = {
                player: playerId,
                phase: 1,
                actions: 0
            }
        }
    };
});