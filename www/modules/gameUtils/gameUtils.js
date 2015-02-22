/*global angular, _*/
"use strict";

angular.module('gameUtils', [])
.controller('GameController', function() {
    
})
.service('fiPlayers', function (TILESET, fiTurns) {
    var that = this,
        p = {
            tile: {},
            cards: []
        },
    currentPlayerIndex,
    relics = [];
    
    this.playerList = [];
    
    this.currentPlayer = function() {
        return that.playerList[currentPlayerIndex] || {};
    };
    
    this.initGame = function(numPlayers) {
        var i,
            newPlayer;
        that.playerList = [];
        for (i = 1; i <= numPlayers; i++) {
            newPlayer = angular.copy(p);
            newPlayer.id = i;
            newPlayer.tile = _.find(TILESET, { "start": newPlayer.id });
            that.playerList.push(newPlayer);
        }
        currentPlayerIndex = 0;
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
        maxActions = 3;
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
