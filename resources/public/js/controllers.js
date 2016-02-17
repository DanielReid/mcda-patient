'use strict';
define(function(require) {
  var angular = require('angular');
  return angular.module('elicit.controllers', [])
    .controller('BaseController', require('./controllers/base'))
    .controller('QuestionnaireController', require('./controllers/questionnaire'))
    .controller('ThankYouController', require('./controllers/thankYou'))
    .controller('WelcomeController', require('./controllers/welcome'));
});
