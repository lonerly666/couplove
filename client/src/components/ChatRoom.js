import {useEffect, useState,useRef, useContext} from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import InputBox from './InputBox';
import '../css/chatroom.css';
import ChatNav from './ChatNav';
import ChatBubble from './ChatBubble';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { SocketContext } from "../SocketContext";
import VideoRespond from './VideoRespond';
import VideoCall from './VideoCall';
import NavBar from './Navbar';


export default function ChatRoom(props)
{
    const [userInfo,setUserInfo] = useState();
    const [userId,setUserId] = useState();
    const [roomId,setRoomId] = useState();
    const [text,setText] = useState("");
    const [userNickname,setUserNickname] = useState();
    const [messages,setMessages] = useState([]);
    const [partnerInfo,setPartnerInfo] = useState([]);
    const [partnerStatus,setPartnerStatus] = useState();
    const [havePartner,setHavePartner] = useState(false);
    const [scrollDir,setScrollDir] = useState(-1);

    // const [isCalling,setIsCalling] = useState();
    const {joinRoom,sendMsg,newMessage,call,callAccepted,startCall} = useContext(SocketContext);

    useEffect(()=>{
        const ac = new AbortController();
        axios.get('/auth/isLoggedIn')
        .then(res =>res.data)
        .catch(err => console.log(err))
        .then(res => {
            if(res.isLoggedIn)
            {
              axios.get('/chat/checkExist')
              .then(res.data)
              .catch(err=>console.log(err))
              .then(res=>{
                if(res.data)
                {
                  document.getElementById('msgBox').style.backgroundImage ='url("/chat/getChatBackground")';
                  document.getElementById('msgBox').style.backgroundSize ='cover';
                }
                else
                {
                  document.getElementById('msgBox').style.backgroundImage = 'url("https://wallpapercave.com/wp/wp4779329.png")';
                }
              })
              
              let userId = res.user._id;
              let partner = res.user.partner;
              let nickname = res.user.nickname;
              setPartnerInfo(res.partnerInfo)
                if(res.user.partner!==null)
                { 
                  setHavePartner(true);
                  axios({ 
                    method:'get',
                    url:'/user/getRoomId',
                    headers: {'Content-Type': 'multipart/form-data'}
                  })
                  .then(res=>res.data)
                  .catch(err=>console.log(err))
                  .then(res=>{
                    setMessages(res.chatInfo.chats.reverse().map(chat=>{
                      return chat;
                    }))
                    let roomId = res.roomInfo._id;
                    setRoomId(roomId);
                    if(nickname)
                    {
                       joinRoom(roomId,userId,nickname);  
                    }
                  })
                }
                setUserId(res.user._id);
                setUserInfo({...res.user});
                setUserNickname(res.user.nickname);
            }
        });
        return function cancel() {
            ac.abort();
          }
    },[])

    useEffect(()=>{
      setMessages(prevData=>{
        return[...prevData,newMessage]
      })
    },[newMessage]);
    useEffect(()=>{
      if(scrollDir===-1)
      {
        document.getElementById('msgBox').scrollTo(0,document.getElementById('msgBox').scrollHeight);      
      }
    },[messages])
    
    function handleSendMsg(event)
    {
      let msg = document.getElementById("chat").value;
      event.preventDefault();
      if(msg.length>0&&roomId)
      {
        sendMsg(msg,userId,userNickname,roomId);
        setText("");
      }
      else{
        alert("You must type something");
      }
      document.getElementById("chat").value = null;
    }

    function toggleBackHome()
    {
      window.open('/','_self');
    }

    async function toggleVideoCall()
    {
      await startCall();
      // await callUser();
    };


    return<div className="chat-div">
      <NavBar havePartner={havePartner}/>
        {call.isReceivingCall &&!callAccepted&&<VideoRespond/>}
     <VideoCall/>
     <div className="chat-container">
     <div className="chat-body" id="chat-body">
     <ChatNav  toggleBackHome={toggleBackHome} partnerInfo={partnerInfo} partnerStatus={partnerStatus} toggleVideoCall={toggleVideoCall}/>
    <div className="chat-messageBox-div" id="msgBox">
        <div className="chat-messageBox">
      {messages&&userInfo&&messages.map((chat,index)=>{
              return <ChatBubble key={index}textInfo={chat} user={userInfo}/>
      })} 
       </div>
    </div>
    <InputBox handleSendMsg={handleSendMsg}/>
     </div>
     </div>
  </div>
}