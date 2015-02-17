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
    playerList = [],
    relics = [];
    
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
    
    function allPlayers() {
        return playerList;
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
        fiTurns.resetTurn(currentPlayer().id);
    }
    
    function gotoPlayer(id) {
        currentPlayerIndex = _.findIndex(playerList, {id: id})
    }
    
    function takeRelic(id) {
        if (!_.includes(relics), id) {
            relics.push(id);
            if (relics.length === 4) {
                alert("You win!");
            }
        }
    }
    
    return {
        tiles: tiles,
        allPlayers: allPlayers,
        currentPlayer: currentPlayer,
        gotoNextPlayer: gotoNextPlayer,
        gotoPlayer: gotoPlayer,
        initGame: initGame,
        playersOnTile: playersOnTile,
        takeRelic: takeRelic
    };
})
.factory('fiTurns', function (PHASE) {
    var turn = {},
        maxActions = 2;
    
    function resetTurn(playerId) {
        turn = {
            player: playerId,
            phase: PHASE.ACTION,
            actions: 0
        };
    }
    
    function addAction() {
        turn.actions += 1;
        if (turn.actions === maxActions) {
            turn.phase = PHASE.TREASURE;
        }
    }
    
    return {
        getTurn: function() { return turn; },
        resetTurn: resetTurn,
        addAction: addAction
    };
});