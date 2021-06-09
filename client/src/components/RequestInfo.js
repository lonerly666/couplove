import ReactAvatar from '@material-ui/core/Avatar';
import CheckIcon from '@material-ui/icons/Check';
import { IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

import axios from 'axios';




export default function RequestInfo(props)
{
    const {reqInfo,setHavePartner} = props;
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
          setHavePartner(true);
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
            <IconButton id="info-req-option"><ClearIcon/></IconButton>
        </div>
    </div>
}