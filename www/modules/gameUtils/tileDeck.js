/*global angular, _*/
"use strict";

angular.module('gameUtils.tileDeck', [])
.service("tileDeck", function(TILESET) {
    var deck = [],
        discard = [];
    
    this.setup = function() {
        deck = _.shuffle(_.pluck(TILESET, "id"));
        discard = [];
    };
    
    this.reset = function() {
        deck.push.apply(deck, _.shuffle(discard));
        discard = [];
    };
    
    this.draw = function() {
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