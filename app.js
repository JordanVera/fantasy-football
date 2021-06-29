/* eslint-disable no-unused-vars */
/* eslint-disable comma-dangle */
/* eslint-disable no-console */
/* eslint-disable arrow-parens */
const createError = require('http-errors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const chalk = require('chalk');
const flash = require('connect-flash');
const session = require('express-session');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const passport = require('passport');
const dotenv = require('dotenv');

const port = process.env.PORT || 3000;
const app = express();
dotenv.config();

const indexRouter = require('./server/index');
require('./server/config/passport')(passport);

// DB Config
const db = process.env.MongoURI;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true })
  .then(() => {
    console.log(chalk.yellowBright('MONGODB Connected'));
    // getSchedule();
  })
  .catch(err => console.log(err));

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    }
    else {
      next();
    }
  });

  console.log = function () { };
}

app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', 1);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(xss());
app.use(hpp());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log({ err });

  // render the error page
  res.status(err.status || 500);
  res.render('error', { err });
});

app.listen(port, () => {
  console.log(`Running on port ${chalk.yellowBright(port)}`);
});

module.exports = app;
