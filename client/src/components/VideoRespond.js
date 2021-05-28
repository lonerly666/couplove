import DoneIcon from '@material-ui/icons/Done';
import IconButton from '@material-ui/core/IconButton';
import { useContext, useEffect } from 'react';
import {SocketContext} from '../SocketContext';
import Avatar from '@material-ui/core/Avatar';
import { Icon } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

export default function VideoRespond(props)
{

    const{answerCall,leaveCall,call,initializeVideo,callUser,declineCall,isCaller,isAnswered} = useContext(SocketContext);


   


   async function answer()
    {
        document.getElementById("container").style.left = "36%"
        document.getElementById("container").style.width = "70%";
        document.getElementById("chat").style.width = "800px";
        document.getElementById("video-div").style.display = "block";
        answerCall();
        
    }
    return <div className="respond">
        <Avatar src="/gridFs/getPartnerProfile" id="caller"/>
        <div className="description">
            <h3>{call.name} wants to call you</h3>
        </div>
        <div className="choice">
        <IconButton id="choice-btn" onClick={answer}><DoneIcon/></IconButton>
        <IconButton id="choice-canc" onClick={declineCall}><ClearIcon/></IconButton>
        </div>
    </div>
}