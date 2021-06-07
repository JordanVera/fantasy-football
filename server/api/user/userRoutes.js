/* eslint-disable comma-dangle */
const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const controller = require('./userController');

const postRegisterLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 HOURS
  max: 21,
  message: 'Why are you trying to create so many users? This route is protected, please try again in 24 hours.'
});

const makePicksLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 MNUTES
  max: 101,
  message: 'You are attempting to alter the picks at a high rate.  Please try again in 10 minutes.  If this is a life or death pick sitution please contact us through email we reply within 30 minutes usually.'
});

// ROUTES
router.route('/login')
  .get(controller.getLogin)
  .post(controller.postLogin);

router.route('/register')
  .get(controller.getRegister)
  .post(postRegisterLimiter, controller.postRegister);

router.route('/logout')
  .get(controller.getLogout);

router.route('/makePicks/:week')
  .post(makePicksLimiter, controller.makePicks);

router.route('/updateUserEmail')
  .post(controller.updateUserEmail);

router.route('/updateUserPassword')
  .post(controller.updateUserPassword);

router.route('/deleteUser')
  .post(controller.deleteUser);

module.exports = router;
