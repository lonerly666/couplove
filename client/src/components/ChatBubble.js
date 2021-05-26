import {useEffect, useState} from 'react';
import '../css/chatBubble.css';


export default function ChatBubble(props)
{
    const{textInfo,user}= props;
    if(textInfo&&textInfo.userId===user._id)
    {       
        return<div className="bubble-div right">
           <div className = "context">
            <p>{textInfo&&textInfo.text}</p>
           </div>
        </div>
    }
    else{
        return<div className="bubble-div left">
            <div className="img-div">
            <img src="/gridFs/getPartnerProfile"/>
            </div>
            <div className = "context">
            <p>{textInfo&&textInfo.text}</p>
           </div>
        </div>
    }
}