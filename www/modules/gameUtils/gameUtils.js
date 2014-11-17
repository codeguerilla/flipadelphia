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
    
    function drawTiles() {
        _.forEach(tiles, function(t) {
            t.level = 0;
            t.tokens = [];
            _.forEach(playerList, function(p) {
                if (t === p.tile) {
                    t.tokens.push("p" + p.id);
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
            playerList = [];
            this.tiles = _.shuffle(TILESET);
            for (i = 1; i <= numPlayers; i++) {
                newPlayer = angular.copy(p);
                newPlayer.id = i;
                newPlayer.tile = _.find(tiles, { "start": newPlayer.id });
                playerList.push(newPlayer);
            };
            currentPlayerIndex = 0;
            drawTiles();
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