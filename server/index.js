const express = require('express');

const app = express();
const api = require('./api/api');

app.use('/api', api);

app.get('/', (req, res, next) => {
  const { user } = req;

  res.render('welcome', {
    user
  });
});

module.exports = app;
