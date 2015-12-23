'use strict';

define(['angular', 'underscore'], function(angular, _) {
  return function($scope, currentWorkspace) {
    var title = function() {
      return "Difference PVF";
    };

    var initialize = function(state) {
      var fields = {
        title: title()
      };
      return _.extend(state, fields);
    };

    return {
      fields: [],
      standardize: _.identity,
      initialize: _.partial(initialize, currentWorkspace),
      nextState: _.identity,
      validChoice: function() { return true; },
      isFinished: function() { return true; },
    };
  };
});
