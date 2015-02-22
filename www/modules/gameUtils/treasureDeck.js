/*global angular, _*/
"use strict";

angular.module('gameUtils.treasureDeck', [])
.service("treasureDeck", function(TREASURES) {
    var deck = [],
        discard = [];
    
    this.setup = function() {
        angular.forEach(TREASURES, function(card) {
            for (var i = 0; i <= card.count; i++) {
                deck.push(card);
            }
        });
        deck = _.shuffle(deck);
        discard = [];
    };
    
    this.draw = function(player) {
        if (deck.length === 0) {
            deck = _.shuffle(discard);
            discard = [];
        }
        return deck.pop();
    };
    
    this.discard = function(card) {
        discard.push(card);
    };
    
    this.getCount = function() {
        return {
            deck: deck.length,
            discard: discard.length
        };
    };
});