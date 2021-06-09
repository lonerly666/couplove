import {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import NavBar from '../Navbar';
import '../../css/memoryBook.css';
import CreatePost from './CreatePost';
import MemoryPost from './MemoryPost';

import Button from '@material-ui/core/Button';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import IconButton from '@material-ui/core/IconButton';

export default function MemoryBook()
{
    const [userInfo,setUserInfo] = useState();
    const [partnerInfo,setPartnerInfo] = useState();
    const [postData,setPostData] = useState();
    const [isEditing,setIsEditing] = useState(false);
    const [isPosting,setIsPosting] = useState(false);
    const [posts,setPosts] = useState([]);
    const [havePartner,setHavePartner] = useState(false);

    const formRef = useRef();


   


    useEffect(()=>{
         axios.get('/auth/isLoggedIn')
        .then(res=>res.data)
        .catch(err=>console.log(err))
        .then(res=>{
            if(res.isLoggedIn)
            {
                if(res.user.partner!==null)
                {
                    setHavePartner(true);
                }
                setUserInfo(res.user);
                setPartnerInfo(res.partnerInfo);

                axios({
                    method:'post',
                    url:'/post/getPosts',
                })
                .then(res=>res.data)
                .catch(err=>console.log(err))
                .then(res=>{
                    if(res.success)
                    {
                        setPosts(res.posts)
                    }
                })
            }
        })
    },[])  

    function handlePost()
    {
        setIsPosting(false);
        setIsEditing(false);
        setPostData();
    }
    return <div className="memoryBook">
        {isPosting&&<CreatePost  setPostData={setPostData} setPost={setPosts} postData={postData} handlePost={handlePost} userInfo={userInfo} setIsPosting={setIsPosting} isEditing={isEditing} setIsEditing={setIsEditing}/>}
        <div className="memoryBook-div" id="memoryBook" style={{opacity:isPosting||isEditing?"0.3":"1"}}>
            <NavBar havePartner={havePartner}/>
                <div className="postDiv">
                    <div className="post-option">
                    <h3>Post Some Memorable Moment Here</h3>
                    <Button variant="contained" id="memory-create-post" onClick={()=>setIsPosting(true)}>
                    Create Memory 🤍
                    </Button>
                    </div>
            </div>
            {posts.map(post=>{
              return  <MemoryPost key={post._id}  setPost={setPosts} setPostData={setPostData} setIsPosting={setIsPosting} isEditing={isEditing} setIsEditing={setIsEditing} post={post} userId={userInfo._id}/>
            })}
        </div>
    </div>
}