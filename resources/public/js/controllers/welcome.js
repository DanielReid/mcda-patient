'use strict';
define(['angular', 'underscore'], function(angular, _) {
  return function($scope, $state, $http, currentWorkspace) {
    $scope.workspace = currentWorkspace;
    $scope.done = currentWorkspace.answers ? currentWorkspace.answers.done : undefined;
    $scope.lastVisited = currentWorkspace.lastVisited;
    $scope.lastSaved = currentWorkspace.lastSaved;

    if (!$scope.lastSaved) {
      $state.go("questionnaire");
    }

    $scope.startOver = function() {
      $http.post("/" + currentWorkspace.id, null).success(function(data) {
        currentWorkspace.answers = null;
        $state.go("questionnaire");
      }).error(function(data, status) {
        $scope.$root.$broadcast("error", data, status);
      });
    }
  };
});
