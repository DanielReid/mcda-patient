'use strict';
define(function(require) {
  var steps = [
  {
    id: 'about',
    title: 'Information about the study',
    handler: 'introduction',
    templateUrl: 'about.html'
  }, {
    id: 'consent',
    title: 'Consent form',
    handler: 'consent',
    templateUrl: 'consent.html'
  }, {
    id: 'demographics',
    title: 'Demographics',
    handler: 'demographics',
    templateUrl: 'demographics.html'
  }, {
    id: 'outcomes',
    title: 'Outcomes',
    handler: 'introduction',
    templateUrl: 'outcomes.html'
  }, {
    id: 'difference-pvf',
    title: 'Difference PVF',
    handler: 'differencePvf',
    templateUrl: 'differencePvf.html',
    explainUrl: 'explainDifferencePvf.html'
  }, {
    id: 'ordinal-swing',
    title: 'Ordinal Swing Elicitation',
    handler: 'ordinalSwing',
    templateUrl: 'ordinalSwing.html',
    explainUrl: 'explainOrdinal.html'
  }, {
    id: 'bisection-swing',
    title: 'Bisection Swing Elicitation',
    handler: 'bisectionSwing',
    templateUrl: 'bisectionSwing.html',
    explainUrl: 'explainTradeOff.html'
  }];

  return {
    steps: steps
  };
});
