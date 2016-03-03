'use strict';
define(['angular', 'underscore'], function(angular, _) {
  return function($scope) {
    return {
      fields: [],
      standardize: _.identity,
      initialize: _.identity,
      nextState: _.identity,
      validChoice: function(state) { return true; },
      isFinished: function(state) { return true; },
      stepCountRange: function(problem) { return [1, 1]; }
    };
  };
});
