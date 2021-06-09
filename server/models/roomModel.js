const mongoose = require('mongoose');
const ObjectId= require('mongodb').ObjectID;

const roomSchema = new mongoose.Schema ({
  userId:ObjectId,
  partnerId:ObjectId,
  roomName:{type:String,default:"Chat Room"}
});



const Room = new mongoose.model("Room", roomSchema);

module.exports = Room;