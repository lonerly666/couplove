import '../../css/createPost.css';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import NativeSelect from '@material-ui/core/NativeSelect';
import ReactAvatar from '@material-ui/core/Avatar';
import React, { useState,useCallback, useRef ,useEffect } from 'react';
import Gallery from 'react-photo-gallery';
import DeleteIcon from '@material-ui/icons/Delete';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import SelectedImage from '../SelectedImage';
import Button from '@material-ui/core/Button';  
import axios from 'axios';

export default function CreatePost(props)
{
    const{setPost,handlePost,userInfo,setIsPosting,setIsEditing,isEditing,postData,setPostData} = props;

    const [text,setText] = useState('');
    const [uploadedFiles,setUploadedFiles] = useState([]);
    const [feeling,setFeeling] = useState();
    const [willBeDeletedFiles, setWillBeDeletedFiles] = useState([]);
    const [deletedExistingFiles, setDeletedExistingFiles] = useState([]);
    const [selectAll] = useState(false);

    const formRef = useRef();

    const imageRenderer = useCallback(
        ({ index, left, top, key, photo }) => (
          <SelectedImage
            selected={selectAll ? true : false}
            key={key}
            margin={"2px"}
            index={index}
            photo={photo}
            left={left}
            top={top}
            handleChooseNotToDeleteFile={handleChooseNotToDeleteFile}
            handleChooseToDeleteFile={handleChooseToDeleteFile}
          />
        ),
        [selectAll,handleChooseNotToDeleteFile,handleChooseToDeleteFile]
      );

          useEffect(()=>{
            if(isEditing)
            {
              setText(postData.post.text);
              setFeeling(postData.post.feeling);
              if(postData.post.fileId){
              setUploadedFiles(postData.post.fileId.map((id,index)=>{
                // console.log(postData.url[index]);
                return {src:postData.url[index],width:1,height:1,fileId:id};
              }))
            }
            }
          },[])

    function handleChooseToDeleteFile(index) {
        setWillBeDeletedFiles(prevData => {
          return [...prevData, index];
        })
      }
  
      function handleChooseNotToDeleteFile(index) {
        setWillBeDeletedFiles(prevData => {
          return prevData.filter(val => {
            return val !== index;
          })
        })
      }

    function handleUploadFiles(event)
    {
        const file = event.target.files[0];
        if(file)
        {
            const re =  /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;
            if (re.test(file.name)) {
                setUploadedFiles(prevData => {
                  return [...prevData, {src: URL.createObjectURL(file), file: file, width:1,height:1}];
                })
              } else {
                alert('only upload image files.')
              }
        }

    }

    async function handleDeleteChosenFiles() {
        const tempDeletedFiles = [...willBeDeletedFiles].sort();
        const tempUploadedFiles = [...uploadedFiles];
        for (var i = tempDeletedFiles.length - 1; i >= 0; i--) {
          if (tempUploadedFiles[tempDeletedFiles[i]].fileId) {
            await setDeletedExistingFiles(prevData => {
              return [...prevData, tempUploadedFiles[tempDeletedFiles[i]].fileId];
            })
          }
          tempUploadedFiles.splice(tempDeletedFiles[i], 1);
        }
        setUploadedFiles(tempUploadedFiles);
        setWillBeDeletedFiles([]);
      }

      async function togglePost()
      {
        const formdata = new FormData(formRef.current);
        if(isEditing)
        { 
          formdata.set('postId',postData.post._id);
          formdata.set('text',text);
          formdata.set('feeling',feeling);
          for (var i = 0; i < deletedExistingFiles.length; i++) {
            formdata.append('deletedFile[]', deletedExistingFiles[i]);
          }
          for (var j = 0; j < uploadedFiles.length; j++) {
            if (uploadedFiles[j].file) {
              formdata.append('fileInput[]', uploadedFiles[j].file);
            } else {
              formdata.append('fileInput[]', uploadedFiles[j].fileId);
            }
          }
          await axios({
            method:'post',
            url:'/post/editPost',
            data:formdata,
            headers:{'Content-Type': 'multipart/form-data'}
          })
          .then(res=>res.data)
          .catch(err=>console.log(err))
          .then(res=>{
            if(res.result)
            {
              setPost(prevData=>{
                const temp=[];
                for(let i =0;i<prevData.length;i++)
                {
                  if(prevData[i]._id===res.result.docs._id)
                  {
                    temp.push(res.result.docs)
                  }
                  else
                  {
                    temp.push(prevData[i]);
                  }
                }
                return temp;
              })
              handlePost();
            }
            else
            {
              alert("Failed to edit post");
            }
          })
          .catch(err=>console.log(err));
        }
        else
        {
            const formdata = new FormData(formRef.current);
            for(let i =0;i<uploadedFiles.length;i++)
            {
                formdata.append('fileInput[]',uploadedFiles[i].file);
            }
            
            await axios({
                method:'post',
                url:'/post/createPost',
                data:formdata
            })
            .then(res=>res.data)
            .catch(err=>console.log(err))
            .then(res=>{
              if(res)
              {
                alert("Memory Created!");
                setPost(prevData=>{
                  return[res,...prevData];
                })
              }
              else
              {
                alert("Opps something went wrong")
              }
            })
            .catch(err=>console.log(err))
            handlePost();
        }
      }
    return<div className="create-div">
           <div className="create-title">
               <h3>{isEditing?"Edit":"Create"} Memory</h3>
               <IconButton onClick={handlePost} id="create-close-btn"><CloseIcon/></IconButton>
            </div>
            <form ref={formRef} >
                <div className="create-feeling-div">
                    <div className="create-profile-pic">
                    <ReactAvatar
                    src="/gridFs/getProfile"
                    />
                    </div>
                    <div className="create-greeting">
                        <p>Hi, {userInfo.nickname} how are you feeling today?</p>
                    </div>
                    <div className="create-select">
                        <NativeSelect
                        value={feeling}
                        onChange={(event)=>setFeeling(event.target.value)}
                        id="create-feeling"
                        name="feeling"
                        >
                        <option aria-label="None" value="" />
                        <option value="happy">Happy 😀 </option>
                        <option value="sad">Sad ☹️</option>
                        <option value="surprise">Surprised 😮</option>
                        <option value="meh">Meh 😕</option>
                        <option value="annoyed">Annoyed 🙄</option>
                        <option value="sleepy">Sleepy 😴</option>
                        <option value="love">Love 🥰</option>
                        <option value="touched">Touched 😭</option>
                        <option value="shy">Shy 😌</option>
                        <option value="amazed">Amazed 🤩</option>
                        </NativeSelect>
                    </div>
                </div>
                <div className="create-textarea">
                        <textarea placeholder="What's on your mind?" rows="10" value={text} onChange={(e)=>setText(e.target.value)} name="text" id="text"/>
                </div>
                <div className="create-gallery-div">
                <Gallery photos={uploadedFiles} renderImage={imageRenderer} id="create-gallery"/> 
                </div>
                <div className="create-btn-div">
                <IconButton id="create-btn" onClick={()=>document.getElementById('create-photo').click()}><AddPhotoAlternateIcon/></IconButton>
                <input type="file" hidden id="create-photo" onChange={handleUploadFiles}/>
                {uploadedFiles.length>0&&<IconButton id="create-btn" onClick={handleDeleteChosenFiles}><DeleteIcon/></IconButton>}
                </div>
                <div className="create-post-div">
                <Button variant="contained" id="create-post-btn" onClick={togglePost}>
                Post
                </Button>
                </div>
            </form>
        </div>
}