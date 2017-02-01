bcrypt = require('bcrypt');

bcrypt.hash(process.argv[2], 10, function(err, hash) {
  if (err) {
    return console.log(err);
  }
  console.log(hash);
});
