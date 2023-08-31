//Importing Modules
const express = require('express');
const userController = require('./../controllers/userController.js');
const authController = require('./../controllers/authController.js');
const multer = require('multer');

//Importing Multer Configeration
const multerConfig = require('./../utils/multerConfig.js');

//Router Declaration
const router = express.Router();

//Multer Configeration

//Setting up multer as middleware to grab photo uploads
const upload = multer({
  storage: multerConfig.storage,
  fileFilter: multerConfig.fileFilter,
  limits: {
    fileSize: multerConfig.fileSizeLimit,
  },
});

//Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.post(
  '/uploadFile',
  authController.protect,
  upload.single('filename'),
  userController.uploadFile
);

router.get('/getMyLinks', authController.protect, userController.getLinks);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    userController.createUser
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getUser
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUser
  );

//Exports
module.exports = router;
