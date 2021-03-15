const express = require('express');
const controller = require('./buyBulletController');

const router = express.Router();

router.route('/buyBullets')
  // .get(controller.getLogin)
  .post(controller.buyBullet);

router.route('/hook')
  // .get(controller.getLogin)
  .post(controller.hook);

module.exports = router;
