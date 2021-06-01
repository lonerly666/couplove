"use strict";


class Post{
    constructor(build){
        if(arguments.length===1&&this.validateBuild(build)){
            const userId = build.userId;
            const userNickname = build.userNickname;
            const timeOfCreation = build.timeOfCreation;
            const text = build.text;
            const feeling = build.feeling;
            const fileId=build.fileId;

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
                fileId:{
                    value:fileId,
                    writable:false
                },
                feeling:{
                    value:feeling,
                    writable:false
                }
            })
        }
    }
    validateBuild(build)
    {
        return (String(build.constructor)===String(Post.Builder));
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
            setFileId(fileId)
            {
                this.fileId = fileId;
                return this;
            }
            setFeeling(feeling)
            {
                this.feeling = feeling; 
                return this;
            }
            build()
            {
                return new Post(this);
            }
        }
        return Builder;
    }

}
module.exports = Post;