import {useEffect, useState,useRef} from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { set } from 'mongoose';
import InputBox from './InputBox';
import '../css/chatroom.css';
import ChatNav from './ChatNav';
import ChatBubble from './ChatBubble';
import ScrollToBottom from 'react-scroll-to-bottom';

let socket;
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

    useEffect(()=>{
        const ac = new AbortController();
        socket = io(ENDPOINT);
        axios.get('/auth/isLoggedIn')
        .then(res =>res.data)
        .catch(err => console.log(err))
        .then(res => {
            if(res.isLoggedIn)
            {
              let userId = res.user._id;
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
                    const formdata = new FormData();
                    formdata.append('roomId',res.roomInfo._id);
                    axios({
                      method:'post',
                      url:'/chat/getChats',
                      data:formdata,
                      headers: {'Content-Type': 'multipart/form-data'}
                    })
                    .then(res=>res.data)
                    .catch(err=>console.log(err))
                    .then(res=>{
                      setMessages(res.chats.reverse().map(chat=>{
                        return chat;
                      }))
                    })
                    let roomId = res.roomInfo._id;
                    setRoomId(roomId);
                    
                   socket.emit('join',{roomId,userId})
                  })
                }
                setUserId(res.user._id);
                setUserInfo({...res.user});
                setUserNickname(res.user.nickname);
            }
        });
        return function cancel() {
            ac.abort();
            socket.emit('disconnect');
            socket.off();
          }
    },[ENDPOINT])

    useEffect(()=>{
      const ac = new AbortController();
      socket.on('chatMsg',(chat)=>{
        setMessages(prevData=>{
          return [...prevData,chat];
        })
      })
      socket.on('userStatus',(status)=>{  
        setPartnerStatus(status);
      })
      return function cancel() {
        ac.abort();
      }
    },[]);


    function handleSendMsg(event)
    {
      let msg = document.getElementById("chat").value;
      event.preventDefault();
      if(msg.length>0&&roomId)
      {
        socket.emit('sendMsg',{msg,roomId,userId,userNickname});
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

    return<div className="container">
		<div className="chat_box">
			<ChatNav toggleBackHome={toggleBackHome} partnerInfo={partnerInfo} partnerStatus={partnerStatus}/>
			<div className="body">
				<div className="incoming">
          <ScrollToBottom>
          {messages.map((chat,index)=>{
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
}