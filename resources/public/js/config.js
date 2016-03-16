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
    id: 'intro1',
    title: 'Introduction',
    handler: require('steps/introduction'),
    templateUrl: 'intro1.html'
  }, {
    id: 'intro2',
    title: 'Introduction',
    handler: require('steps/introduction'),
    templateUrl: 'intro2.html'
  }, {
    id: 'intro3',
    title: 'Introduction',
    handler: require('steps/introduction'),
    templateUrl: 'intro3.html'
  }, {
    id: 'difference-pvf',
    title: 'Difference PVF',
    handler: require('steps/differencePvf'),
    templateUrl: 'differencePvf.html',
    explainUrl: 'explainDifferencePvf.html'
  }, {
    id: 'intro-pfs',
    title: 'Trade-offs Involving Time to Progression',
    handler: require('steps/introduction'),
    templateUrl: 'intro-pfs.html'
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
