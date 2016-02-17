'use strict';
define(['angular', 'underscore'], function(angular, _) {
  return function($scope, $state, currentWorkspace) {
    $scope.workspace = currentWorkspace;
    $scope.done = currentWorkspace.answers ? currentWorkspace.answers.done : undefined;
    $scope.lastVisited = window.models.lastVisited;
    $scope.lastSaved = window.models.lastSaved;
    $scope.questionnaireTitle = window.models.title;

    if (!$scope.lastSaved) {
      $state.go("questionnaire");
    }
  };
});
