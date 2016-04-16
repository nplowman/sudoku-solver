'use strict';

angular.module('sudokuSolver.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', function($scope) {
  $scope.cells = [];
  $scope.rows = [];
  $scope.cols = [];

  $scope.getCells = function() {
    $scope.cells = [];
    for (var x = 0; x < 9; x++) {
      for (var y = 0; y < 9; y++) {
        $scope.cells.push({
          col: x,
          row: y,
          val: ''
        });
      }
    }
  };

  $scope.getRows = function() {
    $scope.rows = [];
    for (var i = 0; i < $scope.cells.length; i++) {
      var cell = $scope.cells[i];
      var cell_row = cell.row;
      if ($scope.rows[cell_row] === undefined) {
        $scope.rows[cell_row] = {cells: []};
      }
      $scope.rows[cell_row].cells.push(cell);
    }
  };

  $scope.init = function() {
    $scope.getCells();
    $scope.getRows();
  }

}]);