const multer = require('multer');
const path = require('path');

exports.storage = multer.memoryStorage(); // Store files in memory for processing

exports.fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file extension'));
  }
};

exports.fileSizeLimit = 1024 * 1024;
