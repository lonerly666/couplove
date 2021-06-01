const mongoose = require('mongoose');
const ObjectId= require('mongodb').ObjectID;

const postSchema = new mongoose.Schema({
    userId:ObjectId,
    nickname:String,
    timeOfCreation:Date,
    text:String,
    feeling:String,
    fileId:[ObjectId],
})

const Post = new mongoose.model("Post",postSchema);

module.exports = Post;