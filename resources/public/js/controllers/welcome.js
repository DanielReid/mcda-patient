'use strict';
define(['angular', 'underscore'], function(angular, _) {
  return function($scope, $state, currentWorkspace) {
    $scope.workspace = currentWorkspace;
    $scope.done = currentWorkspace.answers ? currentWorkspace.answers.done : undefined;
    $scope.lastVisited = currentWorkspace.lastVisited;
    $scope.lastSaved = currentWorkspace.lastSaved;

    if (!$scope.lastSaved) {
      $state.go("questionnaire");
    }

    $scope.startOver = function() {
      currentWorkspace.answers = null;
      $state.go("questionnaire");
    }
  };
});
