"use strict";

angular.module('gameUtils', [])
.factory('fiGameUtils', function (TILESET) {
    var p = {
        tile: {},
        cards: []
    },
    tiles = _.shuffle(TILESET),
    currentPlayerIndex,
    playerList = [];
    
    function drawPlayers() {
        _.forEach(tiles, function(t) {
            t.level = 0;
            _.forEach(playerList, function(p) {
                if (t === p.tile) {
                    t.token = "p" + p.id;
                }
            })
        });
    }
    
    return {
        tiles: tiles,
        playerList: playerList,
        currentPlayer: function() {
            return playerList[currentPlayerIndex];
        },
        initGame: function(numPlayers) {
            var i,
                newPlayer;
            this.tiles = _.shuffle(TILESET);
            for (i = 1; i <= numPlayers; i++) {
                newPlayer = angular.copy(p);
                newPlayer.id = i;
                newPlayer.tile = _.find(tiles, { "start": newPlayer.id });
                playerList.push(newPlayer);
            };
            currentPlayerIndex = 0;
            drawPlayers();
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
});