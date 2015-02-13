/*global angular, _*/
"use strict";

angular.module('gameUtils', [])
.factory('fiGameUtils', function (TILESET, fiTurns) {
    var p = {
        tile: {},
        cards: []
    },
    tiles = _.shuffle(TILESET),
    currentPlayerIndex,
    playerList = [];
    
    function drawTiles() {
        angular.forEach(tiles, function(t) {
            t.level = 0;
            t.tokens = [];
            angular.forEach(playerList, function(p) {
                if (t === p.tile) {
                    t.tokens.push("p" + p.id);
                }
            });
        });
    }
    
    function currentPlayer() {
        return playerList[currentPlayerIndex] || {};
    }
    
    function initGame(numPlayers) {
        var i,
            newPlayer;
        playerList = [];
        this.tiles = _.shuffle(TILESET);
        for (i = 1; i <= numPlayers; i++) {
            newPlayer = angular.copy(p);
            newPlayer.id = i;
            newPlayer.tile = _.find(tiles, { "start": newPlayer.id });
            playerList.push(newPlayer);
        }
        currentPlayerIndex = 0;
        drawTiles();
        fiTurns.resetTurn(currentPlayer().id);
    }

    function playersOnTile(tileId) {
        var players = [];
        angular.forEach(playerList, function(p) {
            if (p.tile.id === tileId) {
                players.push(p);
            }
        });
        return players;
    }
    
    function gotoNextPlayer() {
        currentPlayerIndex += 1;
        if (currentPlayerIndex === playerList.length) {
            currentPlayerIndex = 0;
        }
        return currentPlayerIndex;
    }
    
    return {
        tiles: tiles,
        playerList: playerList,
        currentPlayer: currentPlayer,
        gotoNextPlayer: gotoNextPlayer,
        initGame: initGame,
        playersOnTile: playersOnTile
    };
})
.factory('fiTurns', function () {
    var turn = {},
        maxActions = 2;
    
    function resetTurn(playerId) {
        turn = {
            player: playerId,
            phase: 1,
            actions: 0
        };
    }
    
    function addAction() {
        turn.actions += 1;
        if (turn.actions === maxActions) {
            turn.phase = 2;
        }
    }
    
    return {
        getTurn: function() { return turn; },
        resetTurn: resetTurn,
        addAction: addAction
    };
});