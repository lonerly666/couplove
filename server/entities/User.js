"use strict";

class User{
    
    static FIELDS={
        NICKNAME : 'nickname',
        DATE_OF_BIRTH : 'dateOfBirth',
        GENDER : 'gender',
        PARTNER : 'partner',
        NUM_OF_POSTS : 'numOfPosts',
        BIO: 'bio',
        ROOMID:'roomId'
    }

    constructor(build)
    {
        if(arguments.length===1&&this.validateBuild(build))
        {
            const nickname = build.nickname;
            const dateOfBirth = build.dateOfBirth;
            const gender = build.gender;
            const partner = build.partner;
            const bio = build.bio;
            const numOfPost = build.numOfPost;
            Object.defineProperties(this,{
                nickname:{
                    value:nickname,
                    writable:false
                },
                dateOfBirth :{
                    value: dateOfBirth,
                    writable: false
                },
                gender : {
                    value:gender,
                    writable:false
                },
                bio :{
                    value:bio,
                    writable:false
                },
                numOfPost:{
                    value:numOfPost,
                    writable:false
                },
                partner:{
                    value:partner,
                    writable:false
                },
            });
        }
    }
    validateBuild(build)
    {
        return(String(build.constructor)===String(User.Builder));
    }
    static get Builder()
    {
        class Builder{
            setNickname(nickname){
                this.nickname = nickname;
                return this;
            }
            setDateOfBirth(dateOfBirth){
                this.dateOfBirth = dateOfBirth;
                return this;
            }
            setGender(gender){
                this.gender = gender;
                return this;
            }
            setPartner(partner){
                this.partner = partner;
                return this;
            }
            setBio(bio){
                this.bio = bio;
                return this;
            }
            setNumOfPost(numOfPost){
                this.numOfPost = numOfPost;
                return this;
            }
            build(){
                return new User(this);
            }
        }
        return Builder;
    }
}
module.exports = User;