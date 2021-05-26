import {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import ReactAvatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Activity from './ActivityPane';
import Navbar from '../components/Navbar';
import '../css/home.css';


const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: "100%",
  },
  large: {
    width: theme.spacing(17),
    height: theme.spacing(17),
  },
}));
export default function Home()
{
  const [userInfo,setUserInfo] = useState();
  const [havePartner,setHavePartner] = useState(false);
  const [roomId,setRoomId] = useState();
  const [reqId,setReqId] = useState();
  const [requestList,setRequestList]= useState([]);
  const formRef = useRef();
  const acceptRef = useRef();

    useEffect(() => {
        const ac = new AbortController();
        axios.get('/auth/isLoggedIn')
        .then(res =>res.data)
        .catch(err => console.log(err))
        .then(res => {
          if (res.isLoggedIn===false)
          {
             window.open('/login','_self');
          }
          else
          {
            if(res.user.nickname===undefined)
            {
              window.open('/userProfileForm','_self');
            }
            else
            {
              axios({
                method:'get',
                url:'/user/getRequest',
                headers: {'Content-Type': 'multipart/form-data'}
              })
              .then(res=>res.data)
              .catch(err=>console.log(err))
              .then(res=>{
                let temp=[];
                res.requests.map(list=>{
                  temp.push({...list});
                })
                setRequestList(temp);
              })
              if(res.user.partner!==null)
              {
                setHavePartner(true); 
              }
              setUserInfo({...res.user});
            }
          } 
        })
        return function cancel() {
          ac.abort()
        }
      },[]);

      function handleLogout()
      {
        window.location.href = "/auth/logout";
      }
      function handleChatClick()
      {
        window.open('/chatRoom','_self');
      }

      function handleSendReq(event)
      {
        event.preventDefault();
        const formData = new FormData(formRef.current);
        axios({
          method:'post',
          url:'/user/sendRequest',
          data:formData,
          headers: {'Content-Type': 'multipart/form-data'}
        })
        .then(res=>res.data)
        .catch(err=>console.log(err))
        .then(res=>{
          if(res.isSent)
          {
             alert("sent!");
          }
          else
          {
            alert(res.status);
            console.log(res)
          }
        })
      }
      requestList.map(list=>{
        console.log(list);
      })

      function acceptPartner(event)
      {
        event.preventDefault();
        const formData = new FormData(acceptRef.current);
        axios({
          method:'post',
          url:'/user/acceptRequest',
          data:formData,
          headers: {'Content-Type': 'multipart/form-data'}
        })
        .then(res=>res.data)
        .catch(err=>console.log(err))
        .then(res=>{
          if(res.result)
          {
            console.log(res);
          }
        })
      }
    return <div>
      <Navbar handleSendReq={handleSendReq} formRef = {formRef}/>
      

        <Activity title={"Chat"} desc={"Chat with your loved ones"} link={"/chatRoom"} />
        <Activity title={"Cinema"} desc={"Watch Movie Together!"} link ={"/cinema"}/>
        <input type="submit" value="logout" onClick={handleLogout}/>

        <form onSubmit={acceptPartner} ref={acceptRef}>
        <input type="text" id="reqId" name="senderId"/>
        <input type="submit"/>
        </form>
    </div>
}