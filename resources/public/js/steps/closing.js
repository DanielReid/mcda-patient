'use strict';
define(['angular', 'underscore'], function(angular, _) {
  function initialize(state, settings) {
    state.feedbackText = '';
    return state;
  }

  function save(state) {
    return [{
      'type': 'closing',
      'feedbackText': state.feedbackText
    }];
  }

  return function($scope) {
    return {
      standardize: _.identity,
      initialize: initialize,
      nextState: _.identity,
      save: save,
      validChoice: function(state) { return true; },
      isFinished: function(state) { return true; },
      stepCountRange: function(problem) { return [1, 1]; }
    };
  };
});
