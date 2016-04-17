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
          box: $scope.getBoxNumber(x, y),
          val: '',
          highlight: false
        });
      }
    }
  };

  $scope.getBoxNumber = function(x, y) {
    for (var box_number = 0; box_number < 9; box_number++) {
      var limits = {
        start_x: (box_number % 3) + (box_number % 3 * 2),
        end_x: (box_number % 3) + (box_number % 3 * 2) + 2,
        start_y: Math.floor(box_number/3) + Math.floor(box_number/3) * 2,
        end_y: Math.floor(box_number/3) + Math.floor(box_number/3) * 2 + 2
      };

      if (x >= limits.start_x && x<= limits.end_x && y >= limits.start_y && y <= limits.end_y) {
        break;
      }
    }
    return box_number;
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

  $scope.solvePuzzle = function() {
    do {
      for (var target_number = 1; target_number < 10; target_number++) {
        $scope.checkBoxes(target_number);
        $scope.checkRows(target_number);
        $scope.checkCols(target_number);
      }
    }
    while($scope.puzzleIsUnsolved());
  };

  $scope.checkBoxes = function(target_number) {
    for (var box_number = 0; box_number < 9; box_number ++) {
      var box = $scope.getBox(box_number);
      var empty_candidate_cells = [];

      for (var i = 0; i < box.cells.length; i++) {
        var cell = box.cells[i];
        if (cell.val == '' && !$scope.cellIsBlacklisted(cell, target_number)) {
          empty_candidate_cells.push(cell);
        }
      }

      if (empty_candidate_cells.length == 1) {
        empty_candidate_cells[0].val = target_number;
        empty_candidate_cells[0].highlight = true;
      }
    }
  };

  $scope.checkRows = function(target_number) {
    var empty_candidate_cells = [];
    for (var row_number = 0; row_number < 9; row_number ++) {
      var row = $scope.getRow(row_number);
      for (var i = 0; i < row.cells.length; i++) {
        var cell = row.cells[i];
        if (cell.val == '' && !$scope.cellIsBlacklisted(cell, target_number)) {
          empty_candidate_cells.push(cell);
        }
      }
    }

    if (empty_candidate_cells.length == 1) {
      empty_candidate_cells[0].val = target_number;
      empty_candidate_cells[0].highlight = true;
    }
  };

  $scope.checkCols = function(target_number) {
    var empty_candidate_cells = [];
    for (var col_number = 0; col_number < 9; col_number ++) {
      var col = $scope.getCol(col_number);
      for (var i = 0; i < col.cells.length; i++) {
        var cell = col.cells[i];
        if (cell.val == '' && !$scope.cellIsBlacklisted(cell, target_number)) {
          empty_candidate_cells.push(cell);
        }
      }
    }

    if (empty_candidate_cells.length == 1) {
      empty_candidate_cells[0].val = target_number;
      empty_candidate_cells[0].highlight = true;
    }
  };

  $scope.getBox = function(box_number) {
    var box = {id: box_number, cells: []};
    var limits = {
      start_x: (box_number % 3) + (box_number % 3 * 2),
      end_x: (box_number % 3) + (box_number % 3 * 2) + 2,
      start_y: Math.floor(box_number/3) + Math.floor(box_number/3) * 2,
      end_y: Math.floor(box_number/3) + Math.floor(box_number/3) * 2 + 2
    };

    for (var x = limits.start_x; x <= limits.end_x; x++) {
      for (var y = limits.start_y; y <= limits.end_y; y++) {
        var cell = $scope.getCell(x, y);
        box.cells.push(cell);
      }
    }
    return box;
  };

  //Check to see if cell is on 'blacklist' for a given target number.
  //Being on the "blacklist" means this cell cannot possibly contain the target number,
  //since another cell in the same column or row does already.
  $scope.cellIsBlacklisted = function(cell, target_number) {
    var black_list = $scope.getBlacklist(target_number);
    if (black_list.rows.indexOf(cell.row) != -1
      || black_list.cols.indexOf(cell.col) != -1
      || black_list.boxes.indexOf(cell.box) != -1) {
      return true;
    }
  };

  $scope.getRow = function(row_number) {
    var row = {id: row_number, cells: []};
    for (var col = 0; col < 9; col++) {
      var cell = $scope.getCell(col, row_number);
      row.cells.push(cell);
    }
    return row;
  };

  $scope.getCol = function(col_number) {
    var col = {id: col_number, cells: []};
    for (var row = 0; row < 9; row++) {
      var cell = $scope.getCell(col_number, row);
      col.cells.push(cell);
    }
    return col;
  };

  $scope.getCell = function(x, y) {
    for (var i = 0; i < $scope.cells.length; i++) {
      var cell = $scope.cells[i];
      if (cell.col == x && cell.row == y) {
        return cell;
      }
    }
  };

  //Returns list of rows and columns which already have instance of the target number.
  $scope.getBlacklist = function(target_number) {
    var blacklist = {rows: [], cols: [], boxes: []};

    //Add rows and columns to blacklist
    for (var i = 0; i < $scope.cells.length; i++) {
      var cell = $scope.cells[i];
      if (cell.val == target_number) {
        if (blacklist.rows.indexOf(cell.row) == -1) {
          blacklist.rows.push(cell.row);
        }
        if (blacklist.cols.indexOf(cell.col) == -1) {
          blacklist.cols.push(cell.col);
        }
      }
    }

    //Add boxes to blacklist
    for (var box_number = 0; box_number < 9; box_number++) {
      var box = $scope.getBox(box_number);
      for (i = 0; i < box.cells.length; i++) {
        cell = box.cells[i];
        if (cell.val == target_number && blacklist.boxes.indexOf(box_number) == -1) {
          blacklist.boxes.push(box_number);
        }
      }
    }

    return blacklist;
  };

  $scope.puzzleIsUnsolved = function(){
    for (var i = 0; i < $scope.cells.length; i++) {
      var cell = $scope.cells[i];
      if (cell.val == '') {
        return true;
      }
    }
  };

  $scope.init = function() {
    $scope.getCells();
    $scope.getRows();
  }

}]);