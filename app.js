//3rd Party Imports
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
// const hpp = require('hpp');

//Self-module Imports
const userRouter = require('./routes/userRouter.js');
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController.js');

//Variable Declarations
const app = express();
console.log(process.env.NODE_ENV);

// 1) MiddleWare Usage
//Set Security Http Headers
app.use(helmet());

//Limit Requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//Body Parser, reading data from the body into req.body
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Data sanitization against NoSQL query Injection
app.use(mongoSanitize());

// Data sanitization against XSS (Cross scite scripting attack)
app.use(xss());

// Prevent Parameter Pollution
// app.use(hpp());

//Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(headers)
  next();
});

// 2) Routes
app.use('/api/v1/users', userRouter);

// 3) Error Handeling Middleware
app.all('*', (req, res, next) => {
  next(new AppError(`Can't Find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// 4) Exporting Variables
module.exports = app;
