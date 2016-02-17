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
      var handlerPath = "../steps/" + step.handler;

      require([handlerPath], function(Handler) {
        currentHandler = $injector.invoke(Handler, this, { $scope: $scope, currentWorkspace: workspace});

        $injector.invoke(Wizard, this, {
          $scope: $scope,
          handler: currentHandler
        });

        $scope.stepTemplate = RootPath + "views/" + step.templateUrl;

        $scope.$apply();
      });
    };

    $scope.nCriteria = _.size(currentWorkspace.problem.criteria);

    $scope.proceed = function(state) {
      if(steps.length === 0) return;
      if(currentHandler.save) {
        state = currentHandler.save(state);
      }

      var nextStep = steps.shift();
      initializeStep(nextStep, state);

      var results = { 'results': _.pick(state, ['prefs', 'personal']), 'step': nextStep.id };
      console.log(results);
      $http.post("/" + window.models.id, results).success(function(data) {
      }).error(function(data, status) {
        $scope.$root.$broadcast("error", data, status);
      });
    };

    $scope.submit = function(state) {
      if (currentHandler.save) {
        state = currentHandler.save(state);
      }
      var results = {'results': _.pick(state, ['prefs', 'personal']), 'done': true};

      $http.post("/" + window.models.id, results).success(function(data) {
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
      currentWorkspace = {
        problem: currentWorkspace.problem,
        prefs: currentWorkspace.answers.results.prefs
      };
    }
    initializeStep(steps.shift(), currentWorkspace);
  };
});
