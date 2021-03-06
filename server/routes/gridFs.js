require('dotenv').config({path: __dirname + '/../.env'});
const router = require('express').Router();
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const mongoURI = process.env.DBURL;
const videoStorage = require('../GridFsVideoManager');
const conn = mongoose.createConnection(mongoURI);
const methodOverride = require('method-override');
const multer  = require('multer');


let gfs;
router.use(methodOverride('_method'));
conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('profileImg');
});


const upload = multer({storage:videoStorage});


router.get('/getOtherProfile/:id',(req,res)=>{
  const id = new mongoose.mongo.ObjectId(req.params.id)
  gfs.files.findOne({metadata:id},(err,file)=>{
    if(!file||file.length===0)
    {
      res.send(null);
      return null;
    }
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  })
})

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
  
  router.get('/getPartnerProfile', (req, res) => {
    gfs.files.findOne({ metadata:req.user.partner }, (err, file) => {
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