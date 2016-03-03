'use strict';
define(function(require) {
  var angular = require("angular");
  var _ = require("underscore");

  var OrdinalSwing = function($scope, PartialValueFunction) {
    var criteria = {};
    var pvf = PartialValueFunction;

    $scope.pvf = pvf;

    var getReference = function() {
      return _.object(
        _.keys(criteria),
        _.map(criteria, function(criterion) {
          return pvf.worst(criterion);
        })
      );
    };

    var title = function(state) {
      var base = 'Part 2 - question ';
      var total = (_.size(criteria) - 1);
      if (state > total) {
        return base + ' (DONE)';
      }
      return base + state + '/' + total;
    };

    var initialize = function(state) {
      criteria = state.problem.criteria;
      var fields = {
        title: title(1),
        ordinalPrefs: [],
        reference: getReference(),
        choices: (function() {
          var criteria = state.problem.criteria;
          var choices = _.map(_.keys(criteria), function(criterion) {
            var reference = getReference();
            reference[criterion] = pvf.best(criteria[criterion]);
            return reference;
          });
          return _.object(_.keys(criteria), choices);
        })()
      };
      return _.extend(state, fields);
    };


    var validChoice = function(state) {
      return state && _.contains(_.keys(criteria), state.choice);
    };

    var nextState = function(state) {
      if (!validChoice(state)) {
        return null;
      }

      var nextState = angular.copy(state);
      var choice = state.choice;
      nextState.choice = undefined;

      _.each(nextState.choices, function(alternative) {
        alternative[choice] = pvf.best(criteria[choice]);
      });

      function next(choice) {
        delete nextState.choices[choice];
        nextState.reference[choice] = pvf.best(state.problem.criteria[choice]);
        nextState.ordinalPrefs.push(choice);
        nextState.title = title(nextState.ordinalPrefs.length + 1);
      }
      next(choice);

      if (_.size(nextState.choices) === 1) {
        next(_.keys(nextState.choices)[0]);
      }

      return nextState;
    };

    function standardize(prefs) {
      var order = prefs;

      function ordinal(a, b) {
        return {
          type: 'ordinal',
          criteria: [a, b]
        };
      }
      var result = [];
      for (var i = 0; i < order.length - 1; i++) {
        result.push(ordinal(order[i], order[i + 1]));
      }
      if (order.length > 0) {
        var remaining = _.difference(_.keys(criteria), order).sort();
        result = result.concat(_.map(remaining, function(criterion) {
          return ordinal(_.last(order), criterion);
        }));
      }
      return result;
    }

    var isFinished = function(state) {
      return state && _.size(state.choices) === 2;
    };

    var save = function(state) {
      var next = nextState(state);
      return standardize(next.ordinalPrefs);
    };

    return {
      validChoice: validChoice,
      fields: ['choice', 'reference', 'choices', 'standardized', 'ordinalPrefs'],
      nextState: nextState,
      save: save,
      initialize: initialize,
      standardize: _.identity,
      isFinished: isFinished,
      stepCountRange: function(problem) { var n = _.size(problem.criteria); return [n - 1, n - 1]; }
    };
  };

  return OrdinalSwing;
});
