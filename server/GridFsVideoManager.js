const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const multer = require('multer');

const mongoURI = "mongodb+srv://jeremy:JnJc0429@couplove.qvqnv.mongodb.net/Couplove?retryWrites=true&w=majority";

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          metadata:req.user._id,
          aliases:file.originalname,
          bucketName: 'videoUpload'
        };
        resolve(fileInfo);
      });
    });
  }
});

module.exports = storage;
