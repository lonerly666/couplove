const PostModel = require('../models/postModel');
const Post = require('../entities/Post');

class PostManager{

    static async createPost(post)
    {
        return await PostModel.create(this.constructorPost(post))
        .then(docs=>{
            return docs;
        })
        .catch(err=>{
            console.log(err);
        })
    }
    static constructorPost(post)
    {
        return{
            userId:post.userId,
            nickname:post.userNickname,
            timeOfCreation:post.timeOfCreation,
            text:post.text,
            fileId:post.fileId,
            feeling:post.feeling
        }
    }
    static async getPosts(userId,partner)
    {
        try{

            const docs = await PostModel.find({
                $or:[
                    {
                        userId:userId
                    },
                    {
                        userId:partner
                    }
                ]
            }).sort({timeOfCreation:-1});
            return {
                success:true,
                posts:docs
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

    static async editPost(postId,post)
    {
        
       return PostModel.findByIdAndUpdate(postId,post,{new:true})
        .then(docs=>{
            return{
                status:true,
                docs:docs
            }
        })
        .catch(err=>{
            return{
                status:false,
                docs:err
            }
        })
    
        
    }
    static async deletePost(postId)
    {
        return await PostModel.findByIdAndDelete(postId)
        .then(docs=>{
            return{
                status:true,
                result:docs
            }
        })
        .catch(err=>{
            console.log(err)
            return{
                status:false,
                result:err
            }
        })
    }
}
module.exports = PostManager;