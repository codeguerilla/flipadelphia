/*global angular, _*/
"use strict";

angular.module('flipadelphia', 
    [ 'board'
    , 'tiles'
    , 'cards'
    , 'gameUtils'
    , 'gameUtils.treasureDeck'
    , 'gameUtils.tileDeck'
])
.controller('GameController', function($scope, TILESET, PHASE, fiPlayers, fiTurns, treasureDeck, tileDeck) {
    var vm = this;
    function setupBoard() {
        vm.tiles = _.shuffle(TILESET);
        angular.forEach(vm.tiles, function(t) {
            t.level = 0;
            t.tokens = [];
            angular.forEach(fiPlayers.playerList, function(p) {
                if (t === p.tile) {
                    t.tokens.push("p" + p.id);
                }
            });
        });
    }
    
    function drawTreasureCards(player) {
        var i, card;
        for (i = 0; i < 2; i++) {
            card = treasureDeck.draw();
            if (card.type === "WATERSRISE") {
                vm.waterLevel++;
                tileDeck.reset();
                treasureDeck.discard(card);
            } else {
                player.cards.push(card);
            }
        }
    }
  
    function drawTileCards (drawCount) {
        var i, drawnTile, card;
        
        for (i = 0; i < drawCount; i++) {
            card = tileDeck.draw();
            drawnTile = _.find(vm.tiles, {"id": card});
            drawnTile.level = drawnTile.level + 1;
            if (drawnTile.level < 2) {
                tileDeck.discard(card);
            }
        }
    }
    
    this.treasureCount = treasureDeck.getCount;
    this.tileCount = tileDeck.getCount;
    this.currentPlayer = function() {
        return fiPlayers.currentPlayer().id;
    };
    this.playerClass = function() {
        return "player" + fiPlayers.currentPlayer().id;
    };
    
    this.discard = function(cards) {
        treasureDeck.discard(cards);
    };
    
    this.startGame = function (numPlayers) {
        fiPlayers.initGame(numPlayers);
        vm.players = fiPlayers.playerList;
        setupBoard();
        vm.waterLevel = 1;
        treasureDeck.setup();
        tileDeck.setup();
        drawTileCards(6);
    };
    
    $scope.$watch(function() { return fiTurns.turn.phase; }, function (turnPhase) {
        if (turnPhase === PHASE.TREASURE) {
            drawTreasureCards(fiPlayers.currentPlayer());
            drawTileCards(Math.ceil(vm.waterLevel / 2) + 1);
            fiPlayers.gotoNextPlayer();
        }
    });
})
.constant('TILESET', [
    {
        id: 1,
        name: "1",
        start: 1,
        relic: 0
    },
    {
        id: 2,
        name: "2",
        start: 2,
        relic: 0
    },
    {
        id: 3,
        name: "3",
        start: 3,
        relic: 0
    },
    {
        id: 4,
        name: "4",
        start: 4,
        relic: 0
    },
    {
        id: 5,
        name: "5",
        start: 5,
        relic: 0
    },
    {
        id: 6,
        name: "6",
        start: 6,
        relic: 0
    },
    {
        id: 7,
        name: "7",
        start: 0,
        relic: 1
    },
    {
        id: 8,
        name: "8",
        start: 0,
        relic: 1
    },
    {
        id: 9,
        name: "9",
        start: 0,
        relic: 2
    },
    {
        id: 10,
        name: "10",
        start: 0,
        relic: 2
    },
    {
        id: 11,
        name: "11",
        start: 0,
        relic: 3
    },
    {
        id: 12,
        name: "12",
        start: 0,
        relic: 3
    },
    {
        id: 13,
        name: "13",
        start: 0,
        relic: 4
    },
    {
        id: 14,
        name: "14",
        start: 0,
        relic: 4
    },
    {
        id: 15,
        name: "15",
        start: 0,
        relic: 0
    },
    {
        id: 16,
        name: "16",
        start: 0,
        relic: 0
    },
    {
        id: 17,
        name: "17",
        start: 0,
        relic: 0
    },
    {
        id: 18,
        name: "18",
        start: 0,
        relic: 0
    },
    {
        id: 19,
        name: "19",
        start: 0,
        relic: 0
    },
    {
        id: 20,
        name: "20",
        start: 0,
        relic: 0
    },
    {
        id: 21,
        name: "21",
        start: 0,
        relic: 0
    },
    {
        id: 22,
        name: "22",
        start: 0,
        relic: 0
    },
    {
        id: 23,
        name: "23",
        start: 0,
        relic: 0
    },
    {
        id: 24,
        name: "H",
        start: 0,
        relic: 0
    }
])
.constant('TREASURES', [
    {
        type: "RELIC",
        value: 1,
        count: 5
    },
    {
        type: "RELIC",
        value: 2,
        count: 5
    },
    {
        type: "RELIC",
        value: 3,
        count: 5
    },
    {
        type: "RELIC",
        value: 4,
        count: 5
    },
    {
        type: "ACTION",
        value: "H",
        count: 3
    },
    {
        type: "ACTION",
        value: "S",
        count: 2
    },
    {
        type: "WATERSRISE",
        value: "X",
        count: 3
    }
])
.constant('PHASE', {
    ACTION: 1,
    TREASURE: 2,
    FLOOD: 3,
    SWIM: 4
});
