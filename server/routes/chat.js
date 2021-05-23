require('dotenv').config();
const router = require('express').Router();
const multer = require('multer');
const upload = multer();
const ChatManager = require('../dbmanagers/ChatManager');
const specialNum = parseInt(process.env.SPECIAL_NUM, 10);
const MALE = 'male';
const FEMALE = 'female';

router.post('/getChats',upload.none(),async(req,res)=>{
    const result = await ChatManager.getChats(req.body.roomId);
    res.send(result);
})

router.post('/deleteChat',upload.none(),(req,res)=>{
    const result = await ChatManager.deleteChat(req.body.roomId,req.user._id);
    res.send(result);
})

router.post('/sendChat')