import ReactAvatar from '@material-ui/core/Avatar';
import CheckIcon from '@material-ui/icons/Check';
import { IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

import axios from 'axios';




export default function RequestInfo(props)
{
    const {reqInfo,setHavePartner,setRequestList} = props;
    const url = "/gridFs/getOtherProfile/"+reqInfo.senderId;


    function acceptPartner(event)
    {
      event.preventDefault();
      const formdata = new FormData();
      formdata.append('senderId',reqInfo.senderId);
      axios({
        method:'post',
        url:'/user/acceptRequest',
        data:formdata,
        headers: {'Content-Type': 'multipart/form-data'}
      })
      .then(res=>res.data)
      .catch(err=>console.log(err))
      .then(res=>{
        if(res.result)
        {
          setRequestList(prev=>{
            return prev.filter(info=>{
              return info.senderId!==reqInfo.senderId
            })
          })
          setHavePartner(true);
        }
      })
    }
    async function declinePartner(event)
    {
      event.preventDefault();
      const formdata = new FormData();
      formdata.append('senderId',reqInfo.senderId)
      await axios({
        method:'post',
        url:'/user/declineUser',
        data:formdata,
        header:{'Content-Type': 'multipart/form-data'}
      })
      .then(res=>res.data)
      .catch(err=>console.log(err))
      .then(res=>{
        if(res)
        {
          setRequestList(prev=>{
            return prev.filter(info=>{
              return info.senderId!==reqInfo.senderId
            })
          })
        }
        else
        {
          alert("Opps something wrong with the server")
        }
      })
      
    }

    return <div className="info-div">
        <div className="info-sender-profile-div">
            <ReactAvatar
            id="info-sender-avatar"
            src={url}
            />
        </div>
        <div className="info-sender-desc">
            {reqInfo.senderNickname} wants to be your partner<br/>
            <IconButton id="info-req-option" onClick={acceptPartner} ><CheckIcon/></IconButton>
            <IconButton id="info-req-option" onClick={declinePartner}><ClearIcon/></IconButton>
        </div>
    </div>
}