'use strict';

define(['angular'], function(angular) {
  return function($scope, currentWorkspace) {
    $scope.questionnaireTitle = window.models.title;
  };
});
