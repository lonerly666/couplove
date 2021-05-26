import { useContext, useEffect,useRef, useState } from "react"
import { SocketContext } from "../SocketContext";
import '../css/videoCall.css';
import IconButton from '@material-ui/core/IconButton';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import CallEndIcon from '@material-ui/icons/CallEnd';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';

export default function VideoCall()
{
    const {name,callAccepted,myVideo,userVideo,callEnded,stream,callUser,leaveCall,initializeVideo,muteAudio,muteVideo,declineCall,isAnswered} = useContext(SocketContext);
        const [isMuted,setIsMuted] = useState(false);
        const [isDisplayed,setIsDisplayed] = useState(true);
   
 
   
   function handleMute()
   {
           setIsMuted(!isMuted);
           muteAudio();
   }
   function handleDisplay()
   {
           setIsDisplayed(!isDisplayed);
           muteVideo();
   }
       console.log(isAnswered);
        return <div className="video-div" id="video-div">

                
                <div className="vid-call">
                 <video playsInline muted ref={myVideo} autoPlay />        
                </div>
                {callAccepted&&!callEnded&&
                <div className="vid-call1">
                <video playsInline muted ref={userVideo} autoPlay />
                </div>}
                <div className="option-div">
                <IconButton onClick={handleDisplay} className="option-btn" id="display">{isDisplayed?<VideocamIcon/>:<VideocamOffIcon/>}</IconButton>
                <IconButton onClick={isAnswered?leaveCall:declineCall} className="option-btn" id="end"><CallEndIcon fontSize="inherit"/></IconButton>
                <IconButton onClick={handleMute} className="option-btn">{isMuted?<MicOffIcon/>:<MicIcon/>}</IconButton>
                </div>
        </div>
}