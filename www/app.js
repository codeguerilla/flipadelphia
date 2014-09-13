"use strict";

angular.module('flipadelphia', [])
.controller('MainCtrl', function($scope) {
    
})
.directive('gameBoard', function() {
    return {
        restrict: "A",
        templateUrl: "board.html"
    };
});