const express = require('express');
const controller = require('./buyBulletController');

const router = express.Router();

router.route('/buyBullets')
  .post(controller.buyBullet);

router.route('/hook')
  .post(controller.hook);

module.exports = router;
