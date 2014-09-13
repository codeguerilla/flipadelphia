"use strict";

angular.module('flipadelphia', [])
.controller('BoardCtrl', function($scope) {
    var tileSet = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
    
    
    $scope.shuffleTiles = function () {
        $scope.tiles = _.shuffle(tileSet);
    }
    $scope.tiles = angular.copy(tileSet);
})
.directive('gameBoard', function() {
    return {
        restrict: "A",
        templateUrl: "board.html",
        controller: "BoardCtrl"
    };
})
.directive('tile', function() {
    return {
        restrict: "A",
        templateUrl: "tile.html",
        scope: {
            id: "="
        }
    }
});