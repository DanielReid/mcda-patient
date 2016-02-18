'use strict';

define(["underscore"], function(_) {
  return function($scope, currentWorkspace) {
    return {
      fields: ["demographics"],
      standardize: _.identity,
      initialize: _.partial(_.identity, currentWorkspace),
      nextState: _.identity,
      validChoice: function(state) { return true; },
      isFinished: function(state) { return true; },
      save: function(state) {
        return [{ "type": "questions", "answers": state.demographics }];
      }
    };
  };
});
