//Importing From self Modules
const User = require('./../models/userModel.js');
const catchAsync = require('./../utils/catchAsync.js');
const AppError = require('./../utils/appError.js');
const { initializeApp } = require('firebase/app');
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require('firebase/storage');

//Setting Up Firebase Config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

//Initialise a firebase application
initializeApp(firebaseConfig);

//Initialise cloud storage and get reference to the service
const storage = getStorage();

//Helper Functions
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  const dateTime = date + ' ' + time;
  return dateTime;
};

// Export Functions
exports.uploadFile = catchAsync(async (req, res, next) => {
  try {
    const dateTime = giveCurrentDateTime();

    const storageRef = ref(
      storage,
      `${'Name:' + req.user.name + ' Id: ' + req.user._id}/${
        req.file.originalname + '       ' + dateTime
      }`
    );

    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    // by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    //Saving data in database
    const newLinkObj = {
      name: req.file.originalname,
      downloadURL,
    };
    req.user.links.push(newLinkObj);
    await req.user.save({ validateBeforeSave: false });

    //Sending Response
    return res.status(200).json({
      status: 'success',
      message: 'file uploaded to firebase storage',
      data: {
        name: req.file.originalname,
        type: req.file.mimetype,
        downloadURL,
      },
    });
  } catch (error) {
    console.error(error);
    return next(
      new AppError(
        'Error occured while uploading the file. Please Try again later!',
        500
      )
    );
  }
});

exports.getLinks = catchAsync(async (req, res, next) => {
  const myLinks = req.user.links;

  return res.status(200).json({
    status: 'success',
    message: 'Links Found!',
    data: {
      links: myLinks,
    },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'User Found!',
    data: {
      user: newUser,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const reqId = req.params.id;
  const user = await User.findById(reqId);

  res.status(200).json({
    status: 'success',
    message: 'User Found!',
    user,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const reqId = req.params.id;
  const payload = req.body;
  await User.findByIdAndUpdate(reqId, payload);

  res.status(200).json({
    status: 'success',
    message: 'User Updated!',
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const reqId = req.params.id;
  await User.findByIdAndDelete(reqId);

  res.status(204).json({
    status: 'success',
    message: 'User Deleted!',
    data: {
      user: null,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) Create error if user POSTs password data
  if (req.body.password || req.body.password)
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword!',
        400
      )
    );

  //2) Update user Document
  const filteredBody = filterObj(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
