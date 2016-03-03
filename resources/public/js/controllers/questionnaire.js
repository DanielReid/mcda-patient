'use strict';
define(['angular', 'underscore', './helpers/wizard'], function(angular, _, Wizard, require) {

  return function(Config, $scope, $state, $injector, $http, currentWorkspace, RootPath) {
    if (currentWorkspace.answers && currentWorkspace.answers.done) {
      $state.go('thankYou');
      return;
    }
    var steps = angular.copy(Config.steps);
    for (var i = 0; i < steps.length; ++i) {
      steps[i].Handler = $injector.invoke(steps[i].handler, this, { $scope: $scope });
      steps[i].nSteps = steps[i].Handler.stepCountRange(currentWorkspace.problem)[1];
    }

    function countSteps(steps) {
      return _.reduce(steps, function(memo, step) { return memo + step.nSteps; }, 0);
    }
    var nSteps = countSteps(steps);

    var currentHandler = null;

    $scope.progress = 0;

    if (!currentWorkspace.answers) {
      currentWorkspace.answers = {};
    }

    var initializeStep = function(step, workspace) {
      var nRemain = countSteps(steps) + step.nSteps;
      console.log(nRemain, nSteps);
      $scope.progress = (nSteps - nRemain) / nSteps * 100;

      var doInitialize = function() {
        currentHandler = step.Handler;
        $injector.invoke(Wizard, this, {
          $scope: $scope,
          handler: currentHandler,
          workspace: workspace
        });
        $scope.stepTemplate = RootPath + "views/" + step.templateUrl;
      }

      if (step.explainUrl) {
        $scope.stepTemplate = RootPath + "views/" + step.explainUrl;
        $scope.canProceed = function() { return true; };
        $scope.isFinished = function() { return false; };
        $scope.nextState = doInitialize;
        currentHandler = null;
      } else {
        doInitialize();
      }
    };

    $scope.nCriteria = _.size(currentWorkspace.problem.criteria);

    function saveState(state) {
      if(currentHandler.save) {
        var newPrefs = currentHandler.save(state);
        state = _.pick(angular.copy(state), ['problem', 'prefs']);
        state.prefs = (state.prefs ? state.prefs : []).concat(newPrefs);
      }
      return state;
    }

    $scope.proceed = function(state) {
      if(steps.length === 0) return;
      var state = saveState(state);

      var nextStep = steps.shift();
      initializeStep(nextStep, state);

      var results = { 'results': state.prefs, 'step': nextStep.id };
      console.log(results);
      $http.post("/" + currentWorkspace.id, results).success(function(data) {
        currentWorkspace.answers = results;
      }).error(function(data, status) {
        $scope.$root.$broadcast("error", data, status);
      });
    };

    $scope.submit = function(state) {
      var state = saveState(state);
      var results = {'results': state.prefs, 'done': true};

      $http.post("/" + currentWorkspace.id, results).success(function(data) {
        currentWorkspace.answers = results;
        $state.go("thankYou");
      }).error(function(data, status) {
        $scope.$root.$broadcast("error", data, status);
      });
    };

    $scope.isDone = function(state) {
      return currentHandler && currentHandler.isFinished(state) && steps.length === 0;
    };

    if (currentWorkspace.answers.step) {
      console.log("Finding step");
      var idx = _.findIndex(steps, function(step) {
        return step.id === currentWorkspace.answers.step;
      });
      console.log(currentWorkspace.answers.step, idx);
      if (idx < 0) idx = 0;
      steps = _.rest(steps, idx);
    }
    currentWorkspace.prefs = 
      currentWorkspace.answers.results ? currentWorkspace.answers.results : [];
    initializeStep(steps.shift(), currentWorkspace);
  };
});
