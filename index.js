var express = require('express');
var app = express();
var auth = require('./auth'); // HTTP basic authentication
var swig = require('swig'); // templates
var Sequelize = require('sequelize'); // ORM
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./resources/public'));
app.use('/admin', auth.basicAuth('admin', 'test'));

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', './resources/views');
app.set('view cache', false); // disable swig's cache

var db = new Sequelize(
  process.env.SURVEY_DB_NAME,
  process.env.SURVEY_DB_USER,
  process.env.SURVEY_DB_PASSWORD, {
    host: process.env.SURVEY_DB_HOST,
    dialect: 'postgres'
  });

var Questionnaire = db.define('questionnaire', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.TEXT
  },
  problem: {
    type: Sequelize.JSONB
  }
});

var Result = db.define('result', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  questionnaire_id: { // FIXME
    type: Sequelize.INTEGER
  },
  answers: {
    type: Sequelize.JSONB
  },
  url: {
    type: Sequelize.CHAR(12),
    unique: true
  }
});

function questionnaireNotFound(res, id) {
  return function(error) {
    res.send("Questionnaire " + id + " not found");
    res.sendStatus(404);
    res.end();
  };
}

function surveyNotFound(res, url) {
  return function(error) {
    res.send("Survey with ID " + url + " not found");
    res.sendStatus(404);
    res.end();
  };
}

function internalServerError(res) {
  return function (error) {
    res.send(error);
    res.sendStatus(500);
    res.end();
  };
}

app.get('/', function(req, res) {
  res.send('Welcome home!');
  res.end();
});

app.get('/admin', function(req, res) {
  Questionnaire.findAll().then(function(qnaires) {
    res.render('admin/home.html', {
      questionnaires: qnaires
    });
  }).catch(internalServerError(res));
});

app.get('/admin/new/edit', function(req, res) {
  res.render('admin/edit.html', {
    questionnaire_id: "new"
  });
});

app.get('/admin/:id/edit', function(req, res) {
  Questionnaire.findById(req.params.id).then(function(qnaire) {
    res.render('admin/edit.html', {
      questionnaire_id: qnaire.id,
      questionnaire: {
        title: qnaire.title,
        problem: JSON.stringify(qnaire.problem, null, 2)
      }
    });
  }).catch(questionnaireNotFound(res, req.params.id));
});

app.post('/admin/new', function(req, res) {
  var data = {
    title: req.body.title,
    problem: JSON.parse(req.body.problem)
  };
  Questionnaire.create(data).then(function(qnaire) {
    res.redirect('/admin/' + qnaire.get('id'));
  }).catch(internalServerError(res));
});

app.post('/admin/:id', function(req, res) {
  Questionnaire.findById(req.params.id).then(function(qnaire) {
    qnaire.update({
      title: req.body.title,
      problem: JSON.parse(req.body.problem)
    }).then(function() {
      res.redirect('/admin/' + qnaire.get('id'));
    }).catch(internalServerError(res));
  }).catch(questionnaireNotFound(res, req.params.id));
});

function randomUrl() {
  var n = (Math.random() * 1E16) % 1E9; // FIXME
  return n.toString();
}

app.post('/admin/:id/generate-urls', function(req, res) {
  Questionnaire.findById(req.params.id).then(function(qnaire) {
    var urls = [];
    for (var i = 0; i < req.body.urls; ++i) {
      urls.push(randomUrl());
    }
    Result.create({questionnaire_id: req.params.id, url: urls[0]}).then(function() {
      res.redirect('/admin/' + req.params.id);
      res.end();
    }).catch(internalServerError(res));
  }).catch(questionnaireNotFound(res, req.params.id));
});

app.get('/admin/:id', function(req, res) {
  Questionnaire.findById(req.params.id).then(function(qnaire) {
    Result.findAll({"where": {"questionnaire_id": req.params.id}}).then(function(results) {
      res.render('admin/view.html', {
        questionnaire: qnaire,
        results: results
      });
    });
  }).catch(internalServerError(res));
});

app.get('/:survey', function(req, res) {
  Result.find({"where": {"url": req.params.survey}}).then(function(survey) {
    Questionnaire.findById(survey.questionnaire_id).then(function(qnaire) {
      res.render('home.html', {
        id: req.params.survey,
        problem: qnaire.problem
      });
    }).catch(questionnaireNotFound(res, survey.questionnaire_id));
  }).catch(surveyNotFound(res, req.params.survey));
});

Questionnaire.sync().then(function() {
  Result.sync().then(function() {
    app.listen(8080);
  });
});
