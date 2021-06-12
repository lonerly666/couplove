import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

const ENDPOINT='localhost:5000';
let socket;
let isCaller = false;
let name ;
const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  // const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [userId,setUserId] = useState('');
  const [roomId,setRoomId] = useState('');
  const [newMessage,setNewMessage] = useState([]);
  const [partnerId,setPartnerId] = useState();
  const [isCalling,setIsCalling] = useState(false);
  const [noCall,setNoCall] = useState(false);
  const [isOnline,setIsOnline] = useState(true);
  const [users,setUsers] = useState();

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();


   

  useEffect(() => {

    socket = io(ENDPOINT);
     
    socket.on('chatMsg',(chat)=>{
        setNewMessage(chat);
    })

    socket.on('startCalling',e=>{
      callUser();
    })
    socket.on('start',e=>{
      setIsCalling(true);
    })

    socket.on('no',e=>{
      setNoCall(true);
      alert('your partner is not online!')
    })
  }, []);

  useEffect(()=>{
    
    

    if(!isCalling)
    {
      return null;
    }
     

   socket.on('returnDiv',e=>{
      document.getElementById('chat-body').style.marginRight = "auto";
      document.getElementById('chat-body').style.marginLeft = "auto";
      document.getElementById("video-div").style.visibility = "hidden";
      
   })

   socket.on('calluser',async ({ from, name: callerName, signal })=> {
    setCall({ isReceivingCall: true, from, name: callerName, signal });
    
  });

   socket.on('moveDiv',e=>{
    document.getElementById('chat-body').style.marginRight = "auto";
    document.getElementById('chat-body').style.marginLeft = "10px";
    document.getElementById("video-div").style.visibility = "visible";
      
      
   })

    socket.on('dc',e=>{
      leaveCall();
    })

  },[isCalling])

  // useEffect(()=>{
  //   if(callAccepted)
  //   {
  //     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  //     .then((currentStream) => {
  //     setStream(currentStream);
  //     myVideo.current.srcObject = currentStream;
  //     });
  //   }
  // },[callAccepted])

  const startCall  =()=>{
    socket.emit('calling');
  }
  
  const joinRoom = (roomId,userId,nickname) =>{
      socket.emit('join',{userId,roomId});
      setUserId(userId);
      setRoomId(roomId);
      // setName(nickname); 
      name=nickname;
  }
  let audio =true;
  const muteAudio = ()=>{
    audio  = !audio;
    stream.getAudioTracks()[0].enabled = audio;
  }

  let video =true;
  const muteVideo = ()=>{
    video  = !video;
    stream.getVideoTracks()[0].enabled = video;
  }

  const sendMsg = (msg,nickname) =>{
      socket.emit('sendMsg',{msg,userId,nickname,roomId})
  }

  const declineCall = ()=>{
    setCallEnded(true);
    if(isCaller)
    {
      document.getElementById('chat-body').style.marginRight = "auto";
      document.getElementById('chat-body').style.marginLeft = "auto";
      document.getElementById("video-div").style.visibility = "hidden";
    }
    setIsCalling(false);
    window.location.reload();
  }

  const answerCall = async() => {
    let local;
    await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((currentStream) => {
    setStream(currentStream);
    local = currentStream;
    myVideo.current.srcObject = currentStream;
    }); 
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream:local });
    peer.on('signal', (data) => {
      socket.emit('answercall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      console.log("this is the remote stream: " + currentStream);
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  };


  const callUser = async() => {
    if(noCall)
    {
      return null;
    }
    let local;
    await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((currentStream) => {
    setStream(currentStream);
    local = currentStream;
    myVideo.current.srcObject = currentStream;
    }); 
    isCaller = true;
    const peer = new Peer({ initiator: true, trickle: false, stream:local });
    peer.on('signal', (data) => {
      socket.emit('calluser', {  signalData: data,  name });
    });
    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callaccepted', (signal) => {
      console.log('call accepted: ' + signal);
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    if(isCaller)
    {
      document.getElementById('chat-body').style.marginRight = "auto";
      document.getElementById('chat-body').style.marginLeft = "auto";
      document.getElementById("video-div").style.visibility = "hidden";
    }
    if(connectionRef.current)connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      newMessage,
      sendMsg,
      joinRoom,
      userVideo,
      stream,
      name,
      callEnded,
      callUser,
      leaveCall,
      answerCall,
      users,
      isOnline,
      startCall,
      muteAudio,
      muteVideo,
      declineCall,
      isCaller,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };