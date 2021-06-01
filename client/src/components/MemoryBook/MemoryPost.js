import '../../css/memoryPost.css'
import ReactAvatar from '@material-ui/core/Avatar';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import IconButton from '@material-ui/core/IconButton';
import ImageGallery from "react-image-gallery";
import { useEffect, useState } from 'react';
import axios from 'axios';


export default function MemoryPost(props)
{
    const{post,userId,setIsEditing,setPostData,setIsPosting,setPost} = props
    const [openMore,setOpenMore] = useState(false);
    const [url,setUrl] = useState([]);
    useEffect(async()=>{
        let temp =[];
       await post.fileId.map(id=>{
            let url = "/post/getPostImage/"+id;
            temp.push(url);
        })
        setUrl(temp);
    },[post])
    
    function constructGalleryUrls(fileId)
    {
        return fileId.map(id=>{
            let url = "/post/getPostImage/"+id;
            return {original:url};
        })
        
    }
    function handleEdit()
    {
        setPostData({post:post,url:url});
        setIsEditing(true);
        setIsPosting(true);
    }
    async function deletePost()
    {
        const formdata = new FormData();
        formdata.append('postId',post._id);
        for(let i=0;i<post.fileId.length;i++)
        {
            formdata.append('fileId[]',post.fileId[i])
        }
        await axios({
            method:'post',
            url:'/post/deletePost',
            data:formdata,
            headers:{'Content-Type': 'multipart/form-data'}
        })
        .then(res=>res.data)
        .catch(err=>console.log(err))
        .then(res=>{
            if(res.status)
            {
                setPost(prevData=>{
                    return prevData.filter(posts=>{
                        return posts._id !== post._id;
                    })
                })

                alert("Memory deleted");
            }
            else{
                alert("Opps something went wrong with the server!")
            }
        })
    }
    return<div className="post-div">
        {openMore&&<div className="post-more-div">
            <div className="post-more-option edit" onClick={handleEdit}>
            Edit Memory
            </div>
            <div className="post-more-option delete" onClick={deletePost}>
            Delete Memory
            </div>
            </div>}
        <IconButton id="post-more" onClick={()=>setOpenMore(!openMore)}><MoreHorizIcon fontSize="medium"/></IconButton>
        <div className="post-header">
            {userId===post.creatorId?<ReactAvatar src="/gridFs/getProfile" id="post-avatar"/>:<ReactAvatar src="/gridFs/getPartnerProfile" id="post-avatar"/>}
           <div className="post-desc">
            <div className="post-feeling">
                <h3>{post.nickname}</h3>
                <h3> &nbsp;• &nbsp;is feeling {post.feeling}</h3>  
            </div>
              <div className="post-time">
                <p>{post.timeOfCreation}</p>
              </div>
            </div> 
        </div>
        <div className="post-text">
        {post.text}
        </div>
        <div className="post-images">
            <div className="post-img-div">
            <ImageGallery items={constructGalleryUrls(post.fileId)} showFullscreenButton={false} showPlayButton={false} showThumbnails={false} className="post-gallery" />
            </div>
        </div>
    </div>
}