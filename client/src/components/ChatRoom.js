import {useEffect, useState,useRef} from 'react';
import io from 'socket.io-client';

let socket;
export default function ChatRoom(props)
{
    const ENDPOINT = 'localhost:5000';

    useEffect(()=>{
        socket = io(ENDPOINT);
        socket.on('chat-msg',(data)=>{
            console.log(data);
        })
    })

    return<div>
        <div>
            <h1>CHAT</h1>
            
        </div>
    </div>
}