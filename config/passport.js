const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

module.exports = function (passport) {
  passport.use(new LocalStrategy({usernameField: 'idemail'}, (idemail, password, done) => {
    User.findOne({idemail: idemail}).then(user => {
      if (!user) {
        console.log('User not found!');
        return done(null, false); // error, user, message
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          console.log('Password incorrect!');
          return done(null, false);
        }
      });
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
  });
});
}
