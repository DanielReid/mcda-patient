'use strict';
define(['angular', 'underscore'], function(angular, _) {
  return function($scope, currentWorkspace) {
    return {
      fields: [],
      standardize: _.identity,
      initialize: _.partial(_.identity, currentWorkspace),
      nextState: _.identity,
      validChoice: function(state) { return true; },
      isFinished: function(state) { return true; }
    };
  };
});
