var basicAuth = require('basic-auth');
var bcrypt = require('bcrypt');

/**
 * Simple basic auth middleware for use with Express 4.x.
 *
 * @example
 * app.use('/api-requiring-auth', utils.basicAuth('username', 'password'));
 *
 * @param   {string}   username Expected username
 * @param   {string}   password Expected password, encrypted using bcrypt
 * @returns {function} Express 4 middleware requiring the given credentials
 */
exports.basicAuth = function(username, bcryptHash) {
  return function(req, res, next) {
    var user = basicAuth(req);

    function askForAuth() {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.sendStatus(401);
    }

    if (!user || user.name !== username) {
      return askForAuth();
    }

    bcrypt.compare(user.pass, bcryptHash, function(err, match) {
      if (!match) {
        return askForAuth();
      }
      next();
    });
  };
};
