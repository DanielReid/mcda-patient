'use strict';
define(function(require) {
  // var criteriaPFS = ['PFS', 'grade2SE', 'grade34SE'];
  // var criteriaOS = ['OS', 'grade2SE', 'grade34SE'];
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
    title: 'About yourself',
    handler: require('steps/demographics'),
    templateUrl: 'demographics.html'
  }, {
    id: 'ordinal-swing-pfs',
    title: 'What improvement matters most to you?',
    handler: require('steps/ordinalSwing'),
    templateUrl: 'ordinalSwing.html',
    // criteriaFilter: criteriaPFS,
    output: 'ordinal-pfs'
  }, {
    id: 'bisection-swing-pfs',
    title: 'How much do you prefer one effect over another?',
    handler: require('steps/bisectionSwing'),
    templateUrl: 'bisectionSwing.html',
    // criteriaFilter: criteriaPFS,
    ordinal: 'ordinal-pfs',
    output: 'bisection-pfs'
  }, {
    id: 'difference-pvf',
    title: 'How does the starting condition influence your opinion of an improvement?',
    handler: require('steps/differencePvf'),
    templateUrl: 'differencePvf.html',
    // criteriaFilter: ['PFS', 'OS', 'grade2SE', 'grade34SE']
  }];

  return {
    steps: steps
  };
});
