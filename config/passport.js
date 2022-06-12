const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

module.exports = function (passport) {
  passport.use(new LocalStrategy({usernameField: 'idemail'}, (idemail, password, done) => {  //idemail로 회원찾기
    User.findOne({idemail: idemail}).then(user => { 
      if (!user) {    //회원이 없을 때
        console.log('User not found!');
        return done(null, false); // error, user, message
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {   //비밀번호 확인
        if (err) throw err;
        if (isMatch) {    //비밀번호 맞을 시
          return done(null, user);
        } else {          //비밀번호 틀렸을 때
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
