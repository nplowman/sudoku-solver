'use strict';

angular.module('sudokuSolver.version', [
  'sudokuSolver.version.interpolate-filter',
  'sudokuSolver.version.version-directive'
])

.value('version', '0.1');
