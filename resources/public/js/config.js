'use strict';
define(function(require) {
  var steps = [{
    id: 'consent',
    title: 'Consent form',
    handler: 'consent',
    templateUrl: 'consent.html'
  }, {
    id: 'introduction',
    title: 'General introduction',
    handler: 'introduction',
    templateUrl: 'introduction.html'
  }, {
    id: 'explain-difference-pvf',
    title: 'What is difference PVF',
    handler: 'introduction',
    templateUrl: 'explainDifferencePvf.html'
  }, {
    id: 'difference-pvf',
    title: 'Difference PVF',
    handler: 'differencePvf',
    templateUrl: 'differencePvf.html'
  }, {
    id: 'explain-ordinal',
    title: 'What is ordinal elicitation',
    handler: 'introduction',
    templateUrl: 'explainOrdinal.html'
  }, {
    id: 'ordinal-swing',
    title: 'Ordinal Swing Elicitation',
    handler: 'ordinalSwing',
    templateUrl: 'ordinalSwing.html'
  }, {
    id: 'explain-trade-off',
    title: 'Explaining Trade Off steps',
    handler: 'introduction',
    templateUrl: 'explainTradeOff.html'
  }, {
    id: 'bisection-swing',
    title: 'Bisection Swing Elicitation',
    handler: 'bisectionSwing',
    templateUrl: 'bisectionSwing.html'
  }];

  return {
    steps: steps
  };
});
