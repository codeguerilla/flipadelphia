/*global angular, _*/
"use strict";

angular.module('gameUtils', [])
.service('fiGameUtils', function (TILESET, fiTurns) {
    var that = this,
        p = {
            tile: {},
            cards: []
        },
    currentPlayerIndex,
    relics = [];
    
    function drawTiles() {
        angular.forEach(that.tiles, function(t) {
            t.level = 0;
            t.tokens = [];
            angular.forEach(that.playerList, function(p) {
                if (t === p.tile) {
                    t.tokens.push("p" + p.id);
                }
            });
        });
    }
    
    this.tiles = _.shuffle(TILESET);
    this.playerList = [];
    
    this.currentPlayer = function() {
        return that.playerList[currentPlayerIndex] || {};
    };
    
    this.initGame = function(numPlayers) {
        var i,
            newPlayer;
        that.playerList = [];
        this.tiles = _.shuffle(TILESET);
        for (i = 1; i <= numPlayers; i++) {
            newPlayer = angular.copy(p);
            newPlayer.id = i;
            newPlayer.tile = _.find(that.tiles, { "start": newPlayer.id });
            that.playerList.push(newPlayer);
        }
        currentPlayerIndex = 0;
        drawTiles();
        fiTurns.resetTurn(that.currentPlayer().id);
    };

    this.playersOnTile = function(tileId) {
        var players = [];
        angular.forEach(that.playerList, function(p) {
            if (p.tile.id === tileId) {
                players.push(p);
            }
        });
        return players;
    };
    
    this.gotoNextPlayer = function() {
        currentPlayerIndex += 1;
        if (currentPlayerIndex === that.playerList.length) {
            currentPlayerIndex = 0;
        }
        fiTurns.resetTurn(that.currentPlayer().id);
    };
    
    this.gotoPlayer = function(id) {
        currentPlayerIndex = _.findIndex(that.playerList, {id: id});
    };
    
    this.takeRelic = function(id) {
        if (!_.includes(relics), id) {
            relics.push(id);
            if (relics.length === 4) {
                alert("You win!");
            }
        }
    };
})
.service('fiTurns', function (PHASE) {
    var that = this,
        maxActions = 2;
    this.turn = {};
    
    this.resetTurn = function(playerId) {
        that.turn = {
            player: playerId,
            phase: PHASE.ACTION,
            actions: 0
        };
    };
    
    this.addAction = function() {
        that.turn.actions += 1;
        if (that.turn.actions === maxActions) {
            that.turn.phase = PHASE.TREASURE;
        }
    };
});
