const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;
const UserModel = require('../models/userModel');
const User = require('../entities/User');
const PartnerReqModel = require('../models/partnerReqModel')

class UserManager{
    static async saveInfo(userId,user){
        return UserModel.findByIdAndUpdate(userId,this.constructUserInfo(user),{new:true})
        .then(docs=>{
            return docs;
        })
        .catch(err=>{
            console.log(err);
        })
    }
    static constructUserInfo(user){
        return{
            nickname:user.nickname,
            dateOfBirth: user.dateOfBirth,
            gender:user.gender,
            bio: user.bio,
            partner:user.partner,
        }
    }
    static async getUser(userId) {
        return UserModel.findById(userId)
          .then(docs => {
            return docs;
          })
          .catch(err => {
            console.log(err);
          })
      }
    
    static async sendRequest(userId,nickname,partnerId)
    {  
        try{
            const receiverInfo = await UserModel.findById(partnerId);
            if(receiverInfo)
            {
                if(String(userId)===String(receiverInfo._id))
                {
                    return{status:"You can't add yourself as a partner"}
                }
                const requestInfo = await PartnerReqModel.findOne({senderId:userId,receiverId:receiverInfo._id});
                if(requestInfo)
                {
                    return {status:"You have sent this request already"}
                }
                else{
                    await PartnerReqModel.create({senderId:userId,senderNickname:nickname,receiverId:receiverInfo._id});
                    return{status:"sent"}
                }
            }

          } 
        catch(err)
        {
            console.log(err);
            return{status:"no such id!"};
        }
        
    }
    static async getRequests(userId)
    {
        try{
            const requests = await PartnerReqModel.find({receiverId:userId});
            return{
                success:true,
                requests:requests,
            }
        }
        catch(err)
        {
            console.log(err);
            return{
                success:false
            }
        }
    }
    static async declineReq(userId,senderId)
    {
        try{
            const deleted = await PartnerReqModel.findOneAndDelete({senderId:senderId,receiverId:userId});
            if(deleted)
            {
                return{
                declined:true
                }
            }
            else
            {
                return{
                    declined:false
                }
            }
        }
        catch(err)
        {
            console.log(err);
            return{
                declined:false
            }
        }
    }
    static async acceptReq(userId,senderId)
    {
        try{
            const accepted = await PartnerReqModel.findOneAndDelete({senderId:senderId,receiverId:userId});
            if(accepted)
            {
                await PartnerReqModel.findOneAndDelete({senderId:userId,receiverId:senderId});
                await UserModel.findByIdAndUpdate(senderId,{partner:userId});
                await UserModel.findByIdAndUpdate(userId,{partner:senderId});
                return{
                    status:true
                }
            }
            else
            {
                return {
                    status:false
                }
            }
        }
        catch(err)
        {
            console.log(err);
            return{
                status:false
            }
        }
    }
}

module.exports = UserManager;