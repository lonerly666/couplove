const path = require('path');
const crypto = require('crypto');

const GridFsStorage = require('multer-gridfs-storage');

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
          bucketName: 'chatBackground',
          metadata:req.user._id
        };
        resolve(fileInfo);
      });
    });
  }
});

module.exports = storage;
