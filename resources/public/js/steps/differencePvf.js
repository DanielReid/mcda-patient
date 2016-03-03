'use strict';

define(['angular', 'underscore', 'differencePvf'], function(angular, _, DifferencePvf) {
  return function($scope) {
    var nIntervals = 3;
    var criteria = {};
    var criteriaOrder = [];
    var minQuestions = nIntervals - 1;
    var maxQuestions = nIntervals * minQuestions / 2;

    var title = function() {
      return "Difference PVF";
    };

    var generateIntervals = function(state) {
      function generate(criterion) {
        var increasing = criterion.pvf.direction == "increasing";
        var l = increasing ? criterion.pvf.range[0] : criterion.pvf.range[1];
        var r = increasing ? criterion.pvf.range[1] : criterion.pvf.range[0];
        return _.map(_.range(nIntervals), function(i) {
          var w1 = i/nIntervals;
          var w2 = (i + 1)/nIntervals;
          return [w1 * r + (1 - w1) * l, w2 * r + (1 - w2) * l];
        });
      }
      return _.mapObject(state.problem.criteria, generate);
    };

    var initialize = function(state) {
      criteria = state.problem.criteria;
      criteriaOrder = _.sortBy(_.keys(criteria));
      var answers = _.mapObject(criteria, function() { return []; });
      var fields = {
        title: title(),
        prefs: state.prefs || [],
        pvfPrefs: answers,
        intervals: generateIntervals(state),
        criterion: criteriaOrder[0],
        criterionInfo: criteria[criteriaOrder[0]],
        question: DifferencePvf.nextInterval(nIntervals, []),
        stepsRemaining: criteriaOrder.length * maxQuestions
      };
      return _.extend(state, fields);
    };

    var validChoice = function(state) {
      return state.choice === '<' || state.choice === '>' || state.choice === '=';
    };

    var nextState = function(state) {
      if (!validChoice(state)) {
        return null;
      }

      var nextState = angular.copy(state);
      nextState.choice = undefined;
      var answers = nextState.pvfPrefs[state.criterion];
      answers.push(state.question.concat([state.choice]));
      nextState.question = DifferencePvf.nextInterval(nIntervals, answers);
      nextState.stepsRemaining -= 1;

      if (!nextState.question) {
        var idx = _.indexOf(criteriaOrder, state.criterion) + 1;
        nextState.criterion = criteriaOrder[idx];
        nextState.question = DifferencePvf.nextInterval(nIntervals, []);
        nextState.criterionInfo = criteria[criteriaOrder[idx]];
        nextState.stepsRemaining = (criteriaOrder.length - idx) * maxQuestions;
      }

      return nextState;
    };

    var isFinished = function(state) {
      return validChoice(state) && !nextState(state).criterion;
    }

    var standardize = function(prefs) {
      return _.map(criteriaOrder, function(c) {
        return {
          type: 'difference-pvf',
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
      fields: ['criterion', 'criterionInfo', 'intervals', 'choice', 'question', 'pvfPrefs', 'stepsRemaining'],
      initialize: initialize,
      standardize: _.identity,
      nextState: nextState,
      validChoice: validChoice,
      isFinished: isFinished,
      stepCountRange: function(problem) { var n = _.size(problem.criteria); return [minQuestions * n, maxQuestions * n]; },
      save: save
    };
  };
});
