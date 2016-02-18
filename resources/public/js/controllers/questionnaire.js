'use strict';
define(function(require) {
  var angular = require("angular");
  var _ = require("underscore");
  var Wizard = require("./helpers/wizard");

  return function(Config, $scope, $state, $injector, $http, currentWorkspace, RootPath) {
    var steps = angular.copy(Config.steps);
    var currentHandler = null;

    if (!currentWorkspace.answers) {
      currentWorkspace.answers = {};
    }

    var initializeStep = function(step, workspace) {
      var doInitialize = function() {
        var handlerPath = "steps/" + step.handler;

        require([handlerPath], function(Handler) {
          currentHandler = $injector.invoke(Handler, this, { $scope: $scope, currentWorkspace: workspace});

          $injector.invoke(Wizard, this, {
            $scope: $scope,
            handler: currentHandler
          });

          $scope.stepTemplate = RootPath + "views/" + step.templateUrl;

          $scope.$apply();
        });
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

    $scope.proceed = function(state) {
      if(steps.length === 0) return;
      if(currentHandler.save) {
        state = currentHandler.save(state);
      }

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
      if (currentHandler.save) {
        state = currentHandler.save(state);
      }
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
