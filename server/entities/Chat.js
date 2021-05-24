"use strict";


class Chat{
    static FIELDS={
        USER_ID :'userId',
        USER_NICKNAME :'userNickname',
        TIME_OF_CREATION : 'timeOfCreation',
        TEXT :'text',
        ROOM_ID :'roomId'
    }

    constructor(build){
        if(arguments.length===1&&this.validateBuild(build)){
            const userId = build.userId;
            const userNickname = build.userNickname;
            const timeOfCreation = build.timeOfCreation;
            const text = build.text;
            const roomId = build.roomId;

            Object.defineProperties(this,{
                userId:{
                    value:userId,
                    writable:false,
                },
                userNickname:{
                    value:userNickname,
                    writable:false,
                },
                timeOfCreation:{
                    value:timeOfCreation,
                    writable:false,
                },
                text:{
                    value:text,
                    writable:false,
                },
                roomId:{
                    value:roomId,
                    writable:false,
                }
            })
        }
    }
    validateBuild(build)
    {
        return (String(build.constructor)===String(Chat.Builder));
    }
    static get Builder()
    {
        class Builder{
            setUserId(userId){
                this.userId = userId;
                return this;
            }
            setUserNickname(userNickname)
            {
                this.userNickname = userNickname;
                return this;
            }
            setTimeOfCreation(timeOfCreation)
            {
                this.timeOfCreation = timeOfCreation;
                return this;
            }
            setText(text)
            {
                this.text = text;
                return this;
            }
            setRoomId(roomId)
            {
                this.roomId = roomId;
                return this;
            }
            build()
            {
                return new Chat(this);
            }
        }
        return Builder;
    }

}
module.exports = Chat;