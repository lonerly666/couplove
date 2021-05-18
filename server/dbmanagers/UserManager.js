const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;
const UserModel = require('../models/userModel');
const User = require('../entities/User');

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
}

module.exports = UserManager;