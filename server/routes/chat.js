require('dotenv').config();
const router = require('express').Router();
const multer = require('multer');
const ChatManager = require('../dbmanagers/ChatManager');
const specialNum = parseInt(process.env.SPECIAL_NUM, 10);
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const storage = require('../GridFsChatBackground');
const mongoURI = process.env.DBURL;
const conn = mongoose.createConnection(mongoURI);
const MALE = 'male';
const FEMALE = 'female';


let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('chatBackground');
});
const upload = multer({storage:storage});


router.post('/getChats',upload.none(),async(req,res)=>{
    const result = await ChatManager.getChats(req.body.roomId);
    res.send(result);
})

router.post('/deleteChat',upload.none(),async(req,res)=>{
    const result = await ChatManager.deleteChat(req.body.roomId,req.user._id);
    res.send(result);
})

router.post('/uploadChatImg',upload.single('file'),async(req,res)=>{
  res.end();
})


router.get('/checkExist',upload.none(),async(req,res)=>{
  await gfs.files.findOne({metadata:req.user._id},(err,file)=>{
    if(file)
    {
      res.send(true);
      return
    }
    else
    {
      res.send(false);
      return 
    }
  })
})

router.get('/getChatBackground',upload.none(),async(req,res)=>{
   await gfs.files.findOne({ metadata:(req.user._id)}, (err, file) => {
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
})

router.get('/deleteBackground', (req, res) => {
    gfs.files.findOne({ metadata:(req.user._id)}, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
          res.send(true);
        return 
      }
      else{
        gfs.remove({ _id: file._id, root: 'chatBackground' }, (err, gridStore) => {
          if (err) {
            return res.status(404).json({ err: err });
          }
        });
      }
      res.send(false);
    });
});



module.exports = router;