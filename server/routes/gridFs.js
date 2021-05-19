require('dotenv').config({path: __dirname + '/../.env'});
const router = require('express').Router();
const passport = require('passport');
const CLIENT_URL = "http://localhost:3000";
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/couplove";
const storage = require('../GridFsManger');
const conn = mongoose.createConnection(mongoURI);
const methodOverride = require('method-override');
let gfs;
router.use(methodOverride('_method'));
conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('profileImg');
});

router.get('/getProfile', (req, res) => {
    gfs.files.findOne({ metadata:req.user._id }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        res.send(null);
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
  });
  
  router.get('/deleteImg', (req, res) => {
    gfs.files.findOne({ metadata:req.user._id }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return ({status:"ok"});
      }
      else{
        gfs.remove({ _id: file._id, root: 'profileImg' }, (err, gridStore) => {
          if (err) {
            return res.status(404).json({ err: err });
          }
      
          res.redirect('/');
        });
      }

    });
});

  router.get('/checkExists',(req,res)=>{
   gfs.files.findOne({metadata:req.user._id},(err,file)=>{
     if(err)
     {
       res.send({
         err:err
       })
     }
     else
     {
       if(file)
       {
         res.send(true);
       }
       else
       {
         res.send(false);
       }
     }
   });
  });
  module.exports = router;