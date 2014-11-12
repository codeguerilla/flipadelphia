"use strict";

angular.module('gameUtils', [])
.factory('fiPlayers', function () {
    var p = {
        currentTile: {},
        cards: []
    },
    currentPlayer,
    playerList = [];
    
    return {
        playerList: playerList,
        currentPlayer: currentPlayer,
        initPlayerList: function(numPlayers) {
            var i,
                newPlayer;
            for (i = 1; i <= numPlayers; i++) {
                newPlayer = angular.copy(p);
                newPlayer.id = i;
                playerList.push(newPlayer);
            };
        },
        drawPlayers: function(tiles) {
            _.forEach(tiles, function(t) {
                t.level = 0;
                _.forEach(playerList, function(p) {
                    if (t.start === p.id) {
                        t.token = "p" + p.id;
                        p.currentTile = t;
                    }
                })
            });
        }
    };
})
.factory('fiTiles', function(TILESET) {
    var tiles = _.shuffle(TILESET);
    
    return {
        tiles: tiles,
        newTileset: function() {
            tiles = _.shuffle(TILESET);
            return tiles;
        }
    }
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