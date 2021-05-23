const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const PartnerReqSchema = new mongoose.Schema ({
  senderId: ObjectId,
  senderNickname: String,
  receiverId: ObjectId
});

const partnerReq= new mongoose.model("PartnerRequest", PartnerReqSchema);

module.exports = partnerReq;