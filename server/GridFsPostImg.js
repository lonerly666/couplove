const path = require('path');
const crypto = require('crypto');

const GridFsStorage = require('multer-gridfs-storage');

const mongoURI = 'mongodb://localhost:27017/couplove';

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
          bucketName: 'postImage'
        };
        resolve(fileInfo);
      });
    });
  }
});

module.exports = storage;
