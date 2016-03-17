'use strict';
define(['angular', 'underscore'], function(angular, _) {
  var initialize = function(state, settings) {
    var criteria = settings.criteriaFilter ?
      _.pick(state.problem.criteria, settings.criteriaFilter) : state.problem.criteria;
    return _.extend(state, {'criteria': criteria});
  }
  
  return function($scope) {
    return {
      fields: [],
      standardize: _.identity,
      initialize: initialize,
      nextState: _.identity,
      validChoice: function(state) { return true; },
      isFinished: function(state) { return true; },
      stepCountRange: function(problem) { return [1, 1]; }
    };
  };
});
