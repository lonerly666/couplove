const router = require('express').Router();
const multer  = require('multer');
const upload = multer();
const UserManager = require('../dbmanagers/UserManager');
const User = require('../entities/User');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const storage = require('../GridFsManger');
const mongoURI = "mongodb+srv://jeremy:JnJc0429@couplove.qvqnv.mongodb.net/Couplove?retryWrites=true&w=majority";
const conn = mongoose.createConnection(mongoURI);
const RoomModel = require('../models/roomModel');
const ChatManager = require('../dbmanagers/ChatManager');

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('profileImg');
});
const profile = multer({storage:storage});
router.post('/info', profile.single('file'), async (req, res) => {
  // const profilePic = await GridFsManager.uploadProfilePic(req.body.profile,req.userId);
  const user =
      new User.Builder()
      .setNickname(req.body.nickname)
      .setDateOfBirth(new Date(req.body.dateOfBirth))
      .setGender(req.body.gender)
      .setBio(req.body.bio)
      .setPartner(req.body.partner)
      .setDateOfRelationship(req.body.dateOfRelationship?new Date(req.body.dateOfRelationship):null)
      .build(); 
  const updatedUser = await UserManager.saveInfo(req.user._id, user);
  
  res.end();
})

router.post('/sendRequest',upload.none(),async(req,res)=>{
    // const reqId = await UserManager.getUser(req.body.reqId);
    const requestInfo = await UserManager.sendRequest(req.user._id,req.user.nickname,req.body.reqId)
    res.send(requestInfo);
  })  

router.post('/declineRequest',upload.none(),async(req,res)=>{
  const userId = req.user._id;
  const senderId = req.body.senderId;
  const result = await UserManager.declineReq(userId,senderId);
  res.send(result);
})

router.post('/acceptRequest',upload.none(),async(req,res)=>{
  const senderId = req.body.senderId;
  const userId = req.user._id;
  const result = await UserManager.acceptReq(userId,senderId);
  console.log(result);
  if(result.status){
     const roomInfo = await RoomModel.create({userId:userId,partnerId:senderId});
  
  res.send({
    result:result,
    roomInfo:roomInfo
  });
  }
  else
  {
    res.send({
      result:result
    })
  }
})

router.get('/getRequest',upload.none(),async(req,res)=>{
  const result = await UserManager.getRequests(req.user._id);
  res.send({
    ...result
  })
})

router.get('/getRoomId',upload.none(),async(req,res)=>{
  const result1 = await RoomModel.findOne({userId:req.user._id});
  const result2 = await RoomModel.findOne({partnerId:req.user._id});
  if(result1||result2)
  {
    const chatInfo = await ChatManager.getChats(result1?result1._id:result2._id);
    res.send({ status:true,
      chatInfo:chatInfo,
      roomInfo:result1?result1:result2,
    });
  }
  else{
    res.send({
      status:false
    })
  }
})

module.exports = router;