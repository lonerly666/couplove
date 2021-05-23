"use strict"

const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;
const ChatModel = require('../models/chatModel');
const Chat = require('../entities/Chat');
const SPECIAL_NUM = -1;

class ChatManager{
    static createChat(chat){
        return ChatModel.create(this.constructorChat(chat))
        .then(docs=>{
            return docs;
        })
        .catch(err=>{
            console.log(err);
        })

    }
    static constructorChat(chat)
    {
        return{
            userId:chat.userId,
            userNickname = chat.userNickname,
            timeOfCreation = chat.timeOfCreation,
            text = chat.text,
            roomId = chat.roomId,
        }
    }

    static async getChats(roomId)
    {
        const docs = await ChatModel.find({roomId:roomId}).sort({timeOfCreation:SPECIAL_NUM});
        return({
            chats:docs
        })
    }

    static async deleteChat(chatId,userId)
    {
        return await ChatModel.findOneAndDelete({_id:chatId,userId:userId})
        .then(docs=>{
            return docs;
        })
        .catch(err=>{
            console.log(err);
            return;
        })
    }

}