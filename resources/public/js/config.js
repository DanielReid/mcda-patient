'use strict';
define(function(require) {
  var steps = [
  {
    id: 'about',
    title: 'Information about the study',
    handler: require('steps/introduction'),
    templateUrl: 'about.html'
  }, {
    id: 'consent',
    title: 'Consent form',
    handler: require('steps/consent'),
    templateUrl: 'consent.html'
  }, {
    id: 'demographics',
    title: 'Demographics',
    handler: require('steps/demographics'),
    templateUrl: 'demographics.html'
  }, {
    id: 'outcomes',
    title: 'Outcomes',
    handler: require('steps/introduction'),
    templateUrl: 'outcomes.html'
  }, {
    id: 'difference-pvf',
    title: 'Difference PVF',
    handler: require('steps/differencePvf'),
    templateUrl: 'differencePvf.html',
    explainUrl: 'explainDifferencePvf.html'
  }, {
    id: 'ordinal-swing',
    title: 'Ordinal Swing Elicitation',
    handler: require('steps/ordinalSwing'),
    templateUrl: 'ordinalSwing.html',
    explainUrl: 'explainOrdinal.html'
  }, {
    id: 'bisection-swing',
    title: 'Bisection Swing Elicitation',
    handler: require('steps/bisectionSwing'),
    templateUrl: 'bisectionSwing.html',
    explainUrl: 'explainTradeOff.html'
  }];

  return {
    steps: steps
  };
});
