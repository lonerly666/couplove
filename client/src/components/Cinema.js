import ReactPlayer from 'react-player'
import '../css/videoPlayer.css';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import Button from '@material-ui/core/Button';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import VideoList from './VideoList';
import VideoUploadDiv from './VideoUploadDiv';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';
import VolumeOffIcon from '@material-ui/icons/VolumeOff'; 
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import HomeIcon from '@material-ui/icons/Home';

import { FullScreen, useFullScreenHandle } from "react-full-screen";
import io from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

let socket;
export default function Cinema()
{
  const ENDPOINT = 'localhost:5000';
  const handle = useFullScreenHandle();
  const [ready,setReady] = useState(false);
  const [play,setPlay] =useState(false);
  const [openUrl,setOpenUrl] = useState(false);
  const [url,setUrl] = useState();
  const [buffering,setBuffering] = useState(true);
  const [volume,setVolume] = useState(0.5);
  const [isMuted,setIsMuted] = useState(false);
  const [isLoud,setIsLoud] = useState(false);
  const [isFullScreen,setIsFullScreen] = useState(false);

  const videoRef = useRef();
  const urlRef = useRef("");
  const readyToPlay = useRef(false);
  const initialRun = useRef(true);


  useEffect(async()=>{
      const ac = new AbortController();
        socket = io(ENDPOINT);
        if(initialRun.current)
        {
            await axios.get('/user/getRoomId')
            .then(res=>res.data)
            .catch(err=>console.log(err))
            .then(res=>{
                socket.emit('join',res.roomInfo._id);
            });
            
            initialRun.current = false;
        }
        socket.on('changeState',state=>{
            setPlay(state);
        });
        socket.on('refreshPage',e=>{
            window.location.reload();
        })
        socket.on('update',time=>{
            if(urlRef.current==="")
            {
                urlRef.current = time.url;
                setReady(true);
                readyToPlay.current = true;
                setBuffering(false);
                return;
            }
            if(readyToPlay.current)
            {
                if(time.time>videoRef.current.getCurrentTime())
                {
                    if(videoRef.current.getCurrentTime()<(time.time)-1){
                        videoRef.current.seekTo(String(time.time),'seconds');
                    }
                }
            }
        })

        socket.on('updateProgress',pointed=>{
            videoRef.current.seekTo(pointed,'seconds');
        })

        socket.on('onlineUrl',data=>{
            if(data==="")
            {
                document.getElementById('url').value = "";
                return;
            }
            setReady(true);
            urlRef.current=data;
            setUrl(data);
            document.getElementById('url').value = "";
        })

      return function cancel(){
          ac.abort();
      }
  },[])

  function displayProgress()
  {
      socket.emit('keepUpdate',{time:videoRef.current.getCurrentTime(),url:url});
      const point = document.getElementById('progress-point');
      const value = videoRef.current.getCurrentTime()/(videoRef.current.getDuration()/100);
      point.style.left = value+"%";
  }
   
  function handleProgressChange(event)
  {
      const progressBarWidth = document.getElementById("progress-bar");
      const choose = event.nativeEvent.offsetX;
      const pointed = (choose/progressBarWidth.offsetWidth)*videoRef.current.getDuration();     
      socket.emit('changeProgress',pointed) 
      setPlay(true);
  }
  function handleVideoState()
  {
    socket.emit('changeVideoState',play);
  }
  
  function submitUrl(event){
    event.preventDefault();
    const choosenUrl = document.getElementById('url').value;
    socket.emit('onlineUrl',choosenUrl);
  }

  async function handleChooseMovie(filename)
  {
    
    setReady(true);
    const choosenUrl = "/videoFs/choose/"+filename;
    socket.emit('onlineUrl',choosenUrl);
  }
  function handleUrlDiv()
  {
      let state = !openUrl;
    if(state)
    {
        document.getElementById('submitUrl').style.marginLeft =0;
    }
    else
    {
        document.getElementById('submitUrl').style.marginLeft ="-380px";
    };
      setOpenUrl(!openUrl);  
  }

    function handlePlayerVolume()
    {
        const value=document.getElementById("volume").value;
        const actualVolume = parseFloat(value/100);
        if(actualVolume===0)
        {
            setIsMuted(true);
        }
        else
        {
            setIsMuted(false);
        }
        if(value>50)
        {
            setIsLoud(true);
        }
        else
        {
            setIsLoud(false);
        }
        setVolume(actualVolume);
    }
    function handleMute()
    {
        let state = !isMuted;
        if(state)
        {
            setVolume(0);
            document.getElementById('volume').value =0;
        }
        else
        {
            setVolume(0.5);
            document.getElementById('volume').value =50;
        }
        setIsMuted(!isMuted);
    }

    function handleBigScreen()
    {
        let state = !isFullScreen;
        const controls = document.getElementById('controls');
        if(state)
        {
            handle.enter();
            controls.style.bottom="-150px";
            document.getElementById('progress-point').style.background="white";
            document.getElementById('control-btn').style.color="white";
            document.getElementById('control-vlm').style.color="white";
            document.getElementById('fullscreen-btn').style.color="white";
        }
        else
        {
            handle.exit();
            controls.style.bottom="-50px";
            document.getElementById('progress-point').style.background="black";
            document.getElementById('control-btn').style.color="black";
            document.getElementById('control-vlm').style.color="black";
            document.getElementById('fullscreen-btn').style.color="black";
        }
        setIsFullScreen(!isFullScreen);
    }
    return <div className="cinema-div">
        <VideoList handleChooseMovie={handleChooseMovie} socket={socket}/>
        
        <VideoUploadDiv/>
        <div className="submit-url" id="submitUrl">
            <form onSubmit={submitUrl}>
            <input type="text" id="url" placeholder="enter url"/>
            <Button
                type="submit"
                variant="outlined"
                id="submit-url-btn"
            > submit</Button>
            </form>
            <IconButton size="small" id="handleUrlDiv" onClick={handleUrlDiv}>
                {openUrl?<ArrowLeftIcon/>:<ArrowRightIcon/>}
            </IconButton>
        </div>
        <Button variant="outlined" color="black" href="/" id="homeBtn">
        <HomeIcon/>
         </Button>
        <FullScreen
        handle={handle}
        >
        <div className="video-player" id="video-player">
        {buffering&&ready&&<div className="no-video">
            <h1>Loading....</h1>
        </div>}
        {ready?
        <ReactPlayer 
            ref={videoRef}
            playing={play}
            height="100%"
            width= "100%"
            url={urlRef.current}
            volume={volume}
            onProgress={displayProgress}
            onReady ={()=>setBuffering(false)}   
            onError={()=>setReady(false)}
        />:
        <div className="no-video">
            <h2>No Video</h2>
        </div>
        }
        {/* <video src="/videoFs/getVideos" type="video/mp4"/> */}
            <div style={{display:"flex"}} className="progress-bar-div" id="controls">
                <IconButton onClick={handleVideoState} id="control-btn" style={{color:"black"}}>{play?<PauseIcon/>:<PlayArrowIcon/>}</IconButton>
                <IconButton onClick={handleMute} id="control-vlm" style={{color:"black"}}>{isMuted?<VolumeOffIcon/>:isLoud?<VolumeUpIcon/>:<VolumeMuteIcon/>}</IconButton>
                <input type="range" min="0" max="100" id="volume" onChange={handlePlayerVolume}/>
                <div id="progress-bar" className="progress-bar status" onClick={ready?handleProgressChange:""}>
                <div id="progress-point" className="progress-point"></div>
                </div>
                <IconButton onClick={handleBigScreen} id="fullscreen-btn" style={{color:"black"}}>{isFullScreen?<FullscreenExitIcon/>:<FullscreenIcon/>}</IconButton>
            </div>
        </div>
        </FullScreen>
    </div>
}