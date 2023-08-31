//Importing modules
const AppError = require('./../utils/appError.js');

//Implementing Error Handeling
const handleCastErrorDB = function (err) {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = function (err) {
  //RegEx for Matching data between Quotes
  const value = err.keyValue.email;
  const message = `Duplicate Field value: ${value} Please Use anther Value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = function (err) {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid Input Data ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = function () {
  return new AppError('Invalid Token. Please login Again!', 401);
};

const handleJWTExpiredError = function () {
  return new AppError('Your Token has Expired. Please login Again!', 401);
};

const handleMulterSizeError = function () {
  return new AppError(
    'File too large. Please upload a file within 1mb of size!',
    400
  );
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //Operational, Trusted Error: Send to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,

      message: err.message,
    });
  }
  //Programming Or Other unknown Error: Dont send to client
  else {
    //Log Error
    console.log(console.error(err));

    //Send Message
    res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'developement') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') err = handleJWTError();
    if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();
    if (err.code === 'LIMIT_FILE_SIZE') err = handleMulterSizeError();

    sendErrorProd(err, res);
  }
};
