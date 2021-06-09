const mongoose = require('mongoose');
const ObjectId= require('mongodb').ObjectID;

const widgetSchema = new mongoose.Schema({
    userId:ObjectId,
    partnerId:ObjectId,
    type:String,
})

const Widget = new mongoose.model("Widget",widgetSchema);

module.exports = Widget;    