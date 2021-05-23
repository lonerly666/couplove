const mongoose = require('mongoose');
const ObjectId = require("mongodb").ObjectID;

const chatSchema = new mongoose.Schema ({
  userId: ObjectId,
  userNickName: String,
  timeOfCreation: Date,
  text: String,
  roomId: ObjectId,
});

const Chat = new mongoose.model("Chat", chatSchema);

module.exports = Chat;