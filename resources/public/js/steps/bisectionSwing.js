'use strict';
define(function(require) {
  var angular = require("angular");
  var _ = require("underscore");

  return function($scope, PartialValueFunction) {
    var ordinal = 'ordinal';
    var output = 'bisection';

    var getOrdinalPreferences = function(prefs) {
      return _.filter(prefs, function(pref) { return pref.type === ordinal; });
    };

    var getCriteriaOrder = function(prefs) {
      return _.reduce(getOrdinalPreferences(prefs), function(memo, statement) {
        if (memo.length === 0) {
          return statement.criteria;
        } else {
          if (_.last(memo) !== statement.criteria[0]) {
            return null;
          }
          return memo.concat(statement.criteria[1]);
        }
      }, []);
    };

    var criteria = {};
    var pvf = PartialValueFunction;
    $scope.pvf = pvf;

    $scope.title = function(step, total) {
      var base = 'Trade-offs';
      if (step > total) {
        return base + ' (DONE)';
      }
      return base + ' (question ' + step + ' of ' + total + ')';
    };

    function buildLabels(step) {
      return {
        aLabel: String.fromCharCode(65 + (step - 1) * 2),
        bLabel: String.fromCharCode(66 + (step - 1) * 2),
      };
    }

    function buildInitial(state, criterionA, criterionB, step) {
      var bounds = pvf.getBounds(criteria[criterionA]);
      var initial = {
        step: step,
        total: (_.size(criteria) - 1) * 2,
        criterionA: criterionA,
        criterionB: criterionB,
        cutoff: 0.5,
        a: state.problem.criteria[criterionA],
        b: state.problem.criteria[criterionB],
        answers: []
      };
      return _.extend(initial, buildLabels(step));
    }

    var initialize = function(state, settings) {
      criteria = settings.criteriaFilter ?
        _.pick(state.problem.criteria, settings.criteriaFilter) : state.problem.criteria;
      ordinal = settings.ordinal ? settings.ordinal : 'ordinal' ;
      output = settings.output ? settings.output : 'bisection' ;
      state = _.extend(state, {
        'criteriaOrder': getCriteriaOrder(state.prefs),
        'stepsRemaining': (_.size(state.problem.criteria) - 1) * 2
      });

      state = _.extend(state, buildInitial(state, state.criteriaOrder[0], state.criteriaOrder[1], 1));
      return state;
    };

    var validChoice = function(state) {
      if (!state) {
        return false;
      }
      var value = state.choice;
      return !!state.choice;
    };

    var nextState = function(state) {
      if (!validChoice(state)) {
        return null;
      }

      var order = state.criteriaOrder;
      var idx = _.indexOf(order, state.criterionB);

      if (state.cutoff === 0.5) {
        next = { step: 2 * idx };
        if (state.choice === state.criterionB) {
          next.cutoff = 0.75;
        } else {
          next.cutoff = 0.25;
        }
        next.stepsRemaining = state.stepsRemaining - 1
        next = _.extend(next, buildLabels(next.step));
        return _.extend(_.omit(angular.copy(state), "choice"), next);
      }

      var next;
      if (idx > order.length - 2) {
        next = {
          type: 'done',
          step: idx + 1,
          stepsRemaining: state.stepsRemaining - 1
        };
      } else {
        next = buildInitial(state, order[idx], order[idx + 1], 2 * idx + 1);
      }

      function getRatioBounds(state) {
        if (state.cutoff === 0.75) {
          if (state.choice === state.criterionB) {
            return [1, 4/3];
          } else {
            return [4/3, 2];
          }
        } else {
          if (state.choice === state.criterionB) {
            return [2, 4];
          } else {
            return [4, null];
          }
        }
      }

      next.answers = angular.copy(state.answers);
      next.answers.push({
        criteria: [order[idx - 1], order[idx]],
        ratio: getRatioBounds(state),
        type: output
      });
      next.stepsRemaining = state.stepsRemaining - 1;

      return _.extend(_.omit(angular.copy(state), "choice"), next);
    };


    var isFinished = function(state) {
      return state && state.step === state.total;
    };

    var save = function(state) {
      var next = nextState(state);
      return next.answers;
    };

    return {
      isFinished: isFinished,
      validChoice: validChoice,
      fields: ['total',
               'choice',
               'criteriaOrder',
               'a', 'b',
               'criterionA',
               'criterionB',
               'cutoff',
               'answers',
               'stepsRemaining'],
      nextState: nextState,
      standardize: _.identity,
      save: save,
      initialize: initialize,
      stepCountRange: function(problem) { var n = _.size(problem.criteria); return [(n - 1) * 2, (n - 1) * 2]; }
    };
  };
});
