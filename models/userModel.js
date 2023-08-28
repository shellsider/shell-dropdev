//Importing 3rd Party modules
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// const catchAsync = require('../utils/catchAsync');

//Schema Defination
const subSchemaLink = mongoose.Schema({
  name: String,
  downloadURL: String,
});

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A User Must have a name!'],
  },
  email: {
    type: String,
    required: [true, 'A User must enter an email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please Enter a valid email!'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'A User must enter a password!'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please Enter your password again!'],
    validate: {
      //Works only on SAVE or CREATE!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  links: {
    type: [subSchemaLink],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

//Mongoose Middleware
userSchema.pre('save', async function (next) {
  //Only run the function of password was actually modefied
  if (!this.isModified('password')) return next();

  //Hash Password
  this.password = await bcrypt.hash(this.password, 12);

  //Set password confirm as undefined
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//Querry Middleware
userSchema.pre(/^find/, function (next) {
  //'this' points to the current query
  this.find({ active: { $ne: false } });
  next();
});

//Model Creating
const User = mongoose.model('User', userSchema);

module.exports = User;
