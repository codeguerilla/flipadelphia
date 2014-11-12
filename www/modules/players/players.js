"use strict";

angular.module('players', [])
.factory('fiPlayers', function () {
    var p = {
        currentTile: {},
        cards: []
    },
    playerList = [],
    turn = {};
    
    return {
        playerList: playerList,
        turn: turn,
        resetTurn: function(playerId) {
            turn = {
                player: playerId,
                phase: 1,
                actions: 0
            }
        },
        startGame: function(numPlayers) {
            var i,
                newPlayer;
            for (i = 0; i <= numPlayers; i++) {
                newPlayer = angular.copy(p);
                newPlayer.id = i;
                playerList.push(newPlayer);
            };
            this.resetTurn(0);
        }
    };
});