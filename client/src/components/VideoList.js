import { useEffect, useState } from "react";
import axios from 'axios';
import Button from '@material-ui/core/Button';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import IconButton from '@material-ui/core/IconButton';

export default function VideoList(props)
{
    const {handleChooseMovie,socket} = props;
    const [files,setFiles] = useState([]);
    const [dropdown,setDropdown] = useState(false);
    useEffect(()=>{
        axios.get('/videoFs/getAllVideos')
        .then(res=>res.data)
        .catch(err=>console.log(err))
        .then(res=>{
            let temp = [];
            for(let i=0;i<res.length;i++)
            {
                temp.push(res[i]);
            }
            setFiles(temp);
        })

    },[])   
    function handleDropDown()
    {
        let state = !dropdown;
        if(state)
        {
            document.getElementById('video-file').style.top=0;
        }
        else
        {
            document.getElementById('video-file').style.top  = "-68px";
        }
        setDropdown(!dropdown);
    }
    async function handleDeleteVideo(videoId)
    {
        const formdata = new FormData();
        formdata.append('videoId',videoId);
        await axios({
            method:'post',
            url:'/videoFs/deleteVideo',
            data:formdata,
            headers:{'Content-Type': 'multipart/form-data'}
        })
        .then(res=>res.data)
        .catch(err=>console.log(err))
        .then(res=>{
            console.log(res);
            if(res)
            {
              setFiles(prev=>{
                  return prev.filter(file=>{
                      return file._id!==videoId
                  })
              })
              socket.emit('deletedVideo');
           }
        })
    }

    return<div className="video-file" id="video-file">
        {files.map(file=>{
            return<div className="video-list-div">
                <Button key={file._id} variant="outlined" onClick={()=>handleChooseMovie(file.filename)} id="list">{file.aliases}</Button> 
                <button id="video-delete" onClick={()=>handleDeleteVideo(file._id)}>x</button>
            </div>  
        })} 
        <IconButton
        size="small"
        id="drop-down"
        onClick={handleDropDown}
        >
        {dropdown?<ArrowDropUpIcon/>:<ArrowDropDownIcon/>}
        </IconButton>
    </div>

}