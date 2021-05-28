import {useEffect, useState,useRef, useContext} from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import InputBox from './InputBox';
import '../css/chatroom.css';
import ChatNav from './ChatNav';
import ChatBubble from './ChatBubble';
import ScrollToBottom from 'react-scroll-to-bottom';
import { SocketContext } from "../SocketContext";
import VideoRespond from './VideoRespond';
import VideoCall from './VideoCall';

export default function ChatRoom(props)
{
    const ENDPOINT = 'localhost:5000';
    const [userInfo,setUserInfo] = useState();
    const [userId,setUserId] = useState();
    const [roomId,setRoomId] = useState();
    const [text,setText] = useState("");
    const [userNickname,setUserNickname] = useState();
    const [messages,setMessages] = useState([]);
    const [partnerInfo,setPartnerInfo] = useState([]);
    const [isUser,setIsUser] = useState(false);
    const [partnerStatus,setPartnerStatus] = useState();
    // const [isCalling,setIsCalling] = useState();
    const {joinRoom,sendMsg,newMessage,callUser,call,me,callAccepted,onBoth,startCall} = useContext(SocketContext);

    useEffect(()=>{
        const ac = new AbortController();
        axios.get('/auth/isLoggedIn')
        .then(res =>res.data)
        .catch(err => console.log(err))
        .then(res => {
            if(res.isLoggedIn)
            {
              let userId = res.user._id;
              let partner = res.user.partner;
              let nickname = res.user.nickname;
              console.log(nickname);
              setPartnerInfo(res.partnerInfo)
                if(res.user.partner!==null)
                { 
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
        console.log("You cant send anything")
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
    return<div>
        {call.isReceivingCall &&!callAccepted&&<VideoRespond/>}
     <VideoCall/>
      
      <div className="container" id="container">
     
		<div className="chat_box">
			<ChatNav toggleBackHome={toggleBackHome} partnerInfo={partnerInfo} partnerStatus={partnerStatus} toggleVideoCall={toggleVideoCall}/>
			<div className="body">
				<div className="incoming">
          <ScrollToBottom>
          {messages&&userInfo&&messages.map((chat,index)=>{
            return <ChatBubble key={index}textInfo={chat} user={userInfo}/>
          })} 

          </ScrollToBottom>
          
				</div>
				{/* <div class="typing">
					<div class="bubble">
						<div class="ellipsis dot_1"></div>
						<div class="ellipsis dot_2"></div>
						<div class="ellipsis dot_3"></div>
					</div>
				</div> */}
			</div>
			<InputBox handleSendMsg={handleSendMsg}/>
		</div>
	</div>

  </div>
}