'use strict';

define(["underscore"], function(_) {
  return function($scope) {
    return {
      fields: ["demographics"],
      standardize: _.identity,
      initialize: _.identity,
      nextState: _.identity,
      validChoice: function(state) { return true; },
      isFinished: function(state) { return true; },
      save: function(state) {
        return [{ "type": "questions", "answers": state.demographics }];
      },
      stepCountRange: function(problem) { return [1, 1]; }
    };
  };
});
