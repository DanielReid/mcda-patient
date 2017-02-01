'use strict';

define(['angular', 'underscore'], function(angular, _) {
  return function($scope) {
    var nIntervals = 4;
    var criteria = {};
    var criteriaOrder = [];

    var title = function() {
      return "Simple PVF";
    };

    var generateIntervals = function(state) {
      function generate(criterion) {
        var increasing = criterion.pvf.direction == "increasing";
        var l = increasing ? criterion.pvf.range[0] : criterion.pvf.range[1];
        var r = increasing ? criterion.pvf.range[1] : criterion.pvf.range[0];
        return {
          'delta': (criterion.pvf.range[1] - criterion.pvf.range[0]) / nIntervals,
          'intervals': _.map(_.range(nIntervals), function(i) {
            var w1 = i/nIntervals;
            var w2 = (i + 1)/nIntervals;
            return [w1 * r + (1 - w1) * l, w2 * r + (1 - w2) * l];
          })
        };
      }
      return _.mapObject(state.problem.criteria, generate);
    };

    var initialize = function(state, settings) {
      criteria = state.problem.criteria;
      criteriaOrder = settings.criteriaFilter ? settings.criteriaFilter : _.sortBy(_.keys(criteria));
      var answers = _.mapObject(criteria, function() { return []; });
      var fields = {
        title: title(),
        prefs: state.prefs || [],
        pvfPrefs: answers,
        intervals: generateIntervals(state),
        ranks: _.range(1, nIntervals + 1),
        criterion: criteriaOrder[0],
        criterionInfo: criteria[criteriaOrder[0]],
        step: 1,
        choice: []
      };
      return _.extend(state, fields);
    };

    var validChoice = function(state) {
      return state.choice.length === nIntervals && _.every(state.choice, function(x) { return x >= 1 && x <= nIntervals; });
    };

    var nextState = function(state) {
      if (!validChoice(state)) {
        return null;
      }

      var nextState = angular.copy(state);
      nextState.choice = [];
      nextState.pvfPrefs[state.criterion] = state.choice;

      var idx = _.indexOf(criteriaOrder, state.criterion) + 1;
      nextState.criterion = criteriaOrder[idx];
      nextState.criterionInfo = criteria[criteriaOrder[idx]];
      nextState.step = idx + 1;

      return nextState;
    };

    var isFinished = function(state) {
      return validChoice(state) && !nextState(state).criterion;
    }

    var standardize = function(prefs) {
      return _.map(criteriaOrder, function(c) {
        return {
          type: 'simple-pvf',
          criterion: c,
          answers: prefs[c]
        };
      });
    };

    var save = function(state) {
      var next = nextState(state);
      return standardize(next.pvfPrefs);
    };

    return {
      fields: ['criterion', 'criterionInfo', 'intervals', 'ranks', 'choice', 'pvfPrefs'],
      initialize: initialize,
      standardize: _.identity,
      nextState: nextState,
      validChoice: validChoice,
      isFinished: isFinished,
      stepCountRange: function(problem) { return [_.size(problem.criteria), _.size(problem.criteria)]; },
      save: save
    };
  };
});
