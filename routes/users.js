const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

  router.get('/login', (req, res) => {
    res.render('users/login', {error: ''});
  });

  router.get('/register', (req, res) => {
    res.render('users/register', {
      errors: [],
      idemail: '',
      password: '',
      rpassword: '',
      name: '',
      phone: ''
    });
  });

  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/users/login');
  });

  router.post('/register', (req, res) => {
    let errors = [];

    if (req.body.password != req.body.rpassword)
      errors.push({text: 'Password do not match'});
    if (req.body.password.length <5 )
      errors.push({text: 'Password must be at least 5 characters!'});
    // verify if errors exist
    if (errors.length > 0) {
      res.render('users/register', {
        errors,
        idemail: req.body.idemail,
        password: req.body.password,
        rpassword: req.body.rpassword,
        name: req.body.name,
        phone: req.body.phone
      });
    }  else {
      User.findOne({idemail: req.body.idemail}).then(user => {
        if (user) {
          errors.push({text: 'User already exist!'});
          res.render('users/register', {errors, idemail: '', password: '', rpassword: '', name: '', phone: ''});
        } else {
          const newUser = new User({
            idemail: req.body.idemail,
            password: req.body.password,
            name: req.body.name,
            phone: req.body.phone
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save().then( user => {
                console.log(`User ${user.name} register!`);
                res.redirect('/users/login');
              }).catch(err => console.log(err));
            });
          });
        }
      });
    }
  });

  router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/products',
      failureRedirect: '/users/login'
    })(req, res, next);
  });

module.exports = router;
