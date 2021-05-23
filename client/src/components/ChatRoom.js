import {useEffect, useState,useRef} from 'react';
import io from 'socket.io-client';
import axios from 'axios';

let socket;
export default function ChatRoom(props)
{
    const ENDPOINT = 'localhost:5000';
    const [userInfo,setUserInfo] = useState();
    const [roomId,setRoomId] = useState();

    useEffect(()=>{
        const ac = new AbortController();
        axios.get('/auth/isLoggedIn')
        .then(res =>res.data)
        .catch(err => console.log(err))
        .then(res => {
            if(res.isLoggedIn)
            {
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
                    setRoomId(res.roomInfo._id);
                  })
                }
                setUserInfo({...res.user});
            }
        })


        socket = io(ENDPOINT);
        socket.on('chat-msg',(data)=>{
            console.log(data);
        })
        return function cancel() {
            ac.abort()
          }
    },[ENDPOINT])

    console.log(userInfo);
    return<div>
        <div>
            <h1>CHAT</h1>
            
        </div>
    </div>
}