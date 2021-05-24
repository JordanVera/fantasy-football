const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const controller = require('./dashboardController');
const { ensureAuthenticated } = require('../../config/auth');

const dashboardLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 MNUTES
  max: 50,
  message: 'you are trying to access this page too many times, please chill out. try again in 10 minutes'
});

router
  .get('/dashboard', ensureAuthenticated, dashboardLimiter, controller.dashboard);

module.exports = router;
