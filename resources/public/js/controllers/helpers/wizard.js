'use strict';
define(function(require) {
  var angular = require("angular");
  var _ = require("underscore");

  return function($window, $scope, handler, workspace, settings) {
    var PERSISTENT_FIELDS = ["problem", "type", "prefs"];
    var previousStates =  [];
    var nextStates = [];

    $scope.state = (function() {
      var state;
      if (!_.isUndefined(handler.initialize)) {
        state = handler.initialize(workspace, settings);
      }
      return state || {};
    })();

    $scope.canProceed = function(state) {
      return (handler && handler.validChoice(state)) || false;
    };

    $scope.canReturn = function() {
      return previousStates.length > 0;
    };

    $scope.nextState = function(state) {
      $scope.$broadcast('nextState');
      if (!$scope.canProceed(state)) return false;
      var choice = state.choice;

      // History handling
      previousStates.push(state);
      var nextState = nextStates.pop();
      if (nextState && _.isEqual(nextState.previousChoice, choice)) {
        $scope.state = nextState;
        $window.scrollTo(0,0);
        return true;
      } else {
        nextStates = [];
      }

      state = _.pick(state, PERSISTENT_FIELDS.concat(handler.fields));
      nextState = handler.nextState(state);

      if (_.isNumber(nextState.stepsRemaining)) {
        $scope.progress.current = nextState.stepsRemaining;
      }

      nextState.previousChoice = choice;

      nextState.intermediate = handler.standardize(nextState.prefs);

      $scope.state = nextState;

      $window.scrollTo(0,0);
      return true;
    };

    $scope.isFinished = handler.isFinished;

    $scope.previousState = function() {
      $scope.$broadcast('prevState');
      if (previousStates.length === 0) return false;
      nextStates.push(angular.copy($scope.state));

      var previousState = previousStates.pop();

      if (_.isNumber(previousState.stepsRemaining)) {
        $scope.progress.current = previousState.stepsRemaining;
      }

      $scope.state = previousState;
      $window.scrollTo(0,0);
      return true;
    };
  };
});
