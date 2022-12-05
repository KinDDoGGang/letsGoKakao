const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const authMiddleware = require('./auth.middleware.js');
const apiController = require('./api.controller.js');
const loginController = require('./login.controller.js');

const app = express();

const delay = () => (req, res, next) => setTimeout(() => next(), process.env.DELAY_MS || 1000);

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 로그인 post 요청 시 loginController 
app.post('/login', delay(), loginController)
app.use('/api', delay(), authMiddleware, apiController);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// catch error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message
    , status : err.status || 500
  });
});



module.exports = app;
