'use strict';
define(['angular', 'underscore'], function(angular, _) {
  return function($scope) {
    return {
      fields: ["consent"],
      standardize: _.identity,
      initialize: _.identity,
      nextState: _.identity,
      validChoice: function(state) { return state.consent === "consent"; },
      isFinished: function(state) { return state.consent === "consent"; },
      save: function(state) {
        return [{"type": "consent", "date": new Date() }]
      },
      stepCountRange: function(problem) { return [1, 1]; }
    };
  };
});
