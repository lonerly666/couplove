const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const passportLocalMongoose = require('passport-local-mongoose');
const ObjectId= require('mongodb').ObjectID;

const roomSchema = new mongoose.Schema ({
  userId:ObjectId,
  partnerId:ObjectId,
  roomName:{type:String,default:"Chat Room"}
});

roomSchema.plugin(passportLocalMongoose);
roomSchema.plugin(findOrCreate);

const Room = new mongoose.model("Room", roomSchema);

module.exports = Room;