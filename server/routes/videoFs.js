require('dotenv').config({path: __dirname + '/../.env'});
const router = require('express').Router();
const passport = require('passport');
const CLIENT_URL = "http://localhost:3000";
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const mongoURI = process.env.DBURL;
const videoStorage = require('../GridFsVideoManager');
const UserModel = require('../models/userModel');
const conn = mongoose.createConnection(mongoURI);
const methodOverride = require('method-override');
const multer  = require('multer');

let vfs;
router.use(methodOverride('_method'));
conn.once('open', () => {
  // Init stream
  vfs = Grid(conn.db, mongoose.mongo);
  vfs.collection('videoUpload');
});
const upload = multer({storage:videoStorage});

router.post('/upload',upload.single('video'),(req,res)=>{
    res.send({status:true});
})

router.get('/choose/:filename',upload.none(),async(req,res)=>{
    vfs.files.findOne({filename:req.params.filename},(err,file)=>{
        
        if (!file || file.length === 0) {
            res.send(null);
            return null;
          }
          
          if (file.contentType === 'video/mp4') {
            // Read output to browser
            
            const readstream = vfs.createReadStream(file.filename);
            readstream.pipe(res);
          } else {
            
            res.status(404).json({
              err: 'Not a video'
            });
          }
    })
});
router.get('/getAllVideos',upload.none(),async(req,res)=>{
   await vfs.files.find({metadata:req.user._id}).toArray(async(err,file)=>{
     let files = [];
        files.push(...file)
       await vfs.files.find({metadata:req.user.partner}).toArray((err,file)=>{
         files.push(...file);
         res.send(files);
       })
         
    });
})

router.post('/deleteVideo',upload.none(),async(req,res)=>{
  const id = new mongoose.mongo.ObjectId(req.body.videoId)
  await vfs.remove({_id:id, root: 'videoUpload' },(err, gridStore)=>{
    if(err)
    {
      res.send(err);
      return null;
    }
    res.send(true);
  })
})


module.exports = router;