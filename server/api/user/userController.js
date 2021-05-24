/* eslint-disable brace-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable arrow-parens */
/* eslint-disable no-underscore-dangle */
/* eslint-disable comma-dangle */
/* eslint-disable func-names */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
const passport = require('passport');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const chalk = require('chalk');
const User = require('./userModel');
const bulletRepo = require('../buyBullet/buyBulletController');
const { getStartingWeek } = require('../dates/dates.js');

exports.getLogin = (req, res, next) => {
  const { user } = req;

  res.render('login' , {
    user
  });
};

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/api/dashboard',
    failureRedirect: '/api/users/login',
    failureFlash: true
  })(req, res, next);
};

exports.getRegister = (req, res, next) => {
  const { user } = req;

  res.render('register', {
    user
  });
};

exports.postRegister = (req, res) => {
  const {
    name, email, password, password2, promo, phone, user
  } = req.body;
  console.log({body: req.body})

  const errors = [];

  if (!name || !email || !password || !password2 || !phone) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phone) === false) {
    errors.push({ msg: 'please enter a valid phone number' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
      user
    });
  } else {
    User.findOne({ email })
      .then(async user => {
        if (user) {
          errors.push({ msg: 'email is already registered' });
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          // create new user if all validation is successfull
          const newUser = new User({
            name,
            email,
            phone,
            promo,
            password
          });

          const customerId = await bulletRepo.createCustomer({
            customer: {
              email: newUser.email
            }
          });

          console.log(`customer id = ${customerId}`);
          
          // Password Encryption
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              
              newUser.customerId = customerId;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can log in');
                  res.redirect('/api/users/login');
                })
                .catch(error => console.log(error));
            });
          });
        }
      });
  }
};

exports.getLogout = (req, res, next) => {
  req.logout();

  req.flash('success_msg', 'You are logged out');
  res.redirect('/api/users/login');
};

// eslint-disable-next-line consistent-return
exports.makePicks = async (req, res, next) => {
  const picks = req.body;
  const { week } = req.params;

  // this code makes it impossible to make picks past an invalid week
  if (Number(week) < getStartingWeek()) {
    return res.sendStatus(403);
  }

  console.log(week, getStartingWeek(), week < getStartingWeek());
  try {
    // eslint-disable-next-line no-underscore-dangle
    const result = await User.findById(req.user._id);
    const data = { [`week-${week}`]: picks };
    const allPicks = [...result.picks];
    if (allPicks.length > 0) {
      // Search index of pick
      const pickIndex = _.findIndex(allPicks, (pick) => Object.keys(pick)[0] == `week-${week}`);

      // If found, update it
      if (pickIndex !== -1) {
        console.log(chalk.green('true'));
        allPicks[pickIndex] = data;
      }

      // Otherwise, push new pick
      else {
        console.log(chalk.red('false'));
        allPicks.push(data);
      }
    } else {
      allPicks.push(data);
      console.log(chalk.yellow('results.picks is empty'));
    }

    result.picks = allPicks;
    console.log('allPicks', allPicks);
    await result.save();
    res.redirect('/api/dashboard');
  } catch (error) {
    console.log(error);
  }
};
