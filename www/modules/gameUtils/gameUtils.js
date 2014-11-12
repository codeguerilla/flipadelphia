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
            for (i = 0; i <= numPlayers; i++) {
                newPlayer = angular.copy(p);
                newPlayer.id = i;
                playerList.push(newPlayer);
            };
        }
    };
})
.factory('fiTurns', function () {
    var turn = {};
    
    return {
        turn: turn,
        resetTurn: function(playerId) {
            turn = {
                player: playerId,
                phase: 1,
                actions: 0
            }
        }
    };
})