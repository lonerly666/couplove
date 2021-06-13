require('dotenv').config({path: __dirname + '/../.env'});
const router = require('express').Router();
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const mongoURI = process.env.DBURL;
const storage = require('../GridFsHomeBackground');
const conn = mongoose.createConnection(mongoURI);
const multer  = require('multer');


let gfs;
conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('homeBackground');
});


const upload = multer({storage:storage});
router.post('/upload',upload.single('file'),async(req,res)=>{
    res.end();
})
router.post('/checkExist',upload.none(),async(req,res)=>{
    gfs.files.findOne({metadata:req.user._id},(err,file)=>{
        if (file) {
            gfs.remove({ _id: file._id, root: 'homeBackground' }, (err, gridStore) => {
                if (err) {
                  return res.status(404).json({ err: err });
                }
              });
          }
        });
        res.send(true);
})

router.get('/getBackground',upload.none(),async(req,res)=>{
    gfs.files.findOne({ metadata:req.user._id }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
          res.send(false);
          return null;
        }
    
        // Check if image
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
          // Read output to browser
          const readstream = gfs.createReadStream(file.filename);
          readstream.pipe(res);
        } else {
          res.status(404).json({
            err: 'Not an image'
          });
        }
      });
})

module.exports = router;