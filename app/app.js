'use strict';

// Declare app level module which depends on views, and components
angular.module('sudokuSolver', [
  'ngRoute',
  'sudokuSolver.view1',
  'sudokuSolver.view2',
  'sudokuSolver.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
