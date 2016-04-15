'use strict';

angular.module('sudokuSolver.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', function($scope) {
  $scope.rows = 9;
  $scope.cols = 9;

  $scope.getRows = function() {
    return new Array($scope.rows);
  }

  $scope.getCols = function() {
    return new Array($scope.cols);
  }
}]);