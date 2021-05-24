/* eslint-disable comma-dangle */
const router = require('express').Router();
const dashboardRouter = require('./dashboard/dashboardRouter');
const usersRouter = require('./user/userRoutes');
const bulletRouter = require('./buyBullet/buyBulletRoutes');

router.use('/', dashboardRouter);
router.use('/users', usersRouter);
router.use('/bullets', bulletRouter);

module.exports = router;
