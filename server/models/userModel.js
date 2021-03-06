const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const passportLocalMongoose = require('passport-local-mongoose');
const ObjectId= require('mongodb').ObjectID;

const userSchema = new mongoose.Schema ({
  username: String,
  password: String,
  googleId: String,
  facebookId: String,
  nickname: String,
  dateOfBirth: Date,
  bio:String,
  gender: String,
  dateOfRelationship:Date,  
  partner: ObjectId,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

module.exports = User;