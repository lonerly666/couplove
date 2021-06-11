import '../css/navbar.css';

import PartnerReq from  './PartnerReq';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import { IconButton } from '@material-ui/core';
import { useState,useRef } from 'react';
import PhotoIcon from '@material-ui/icons/Photo';
import axios from 'axios';

export default function Navbar(props)
{
    const {handleSendReq,formRef,havePartner,requestList,setHavePartner,setRequestList,isHome} = props;
    const [viewList,setViewList] = useState(false);


    
    async function handleChangeBackground(event)
    {
      await axios({
        method:'post',
        url:'/home/checkExist'
      })
      const formdata = new FormData();
      formdata.append('file',event.target.files[0]);
        await axios({
          method:'post',
          url:'/home/upload',
          data:formdata,
          headers:{'Content-Type':'multipart/formdata'}
        })
        .then(res=>res.data)
        .catch(err=>console.log(err))
        .then(res=>{
            window.location.reload();
        })
    }

    return<div className="nav-div">
        <div className="nav-title" onClick={()=>window.open('/','_self')}><h3>Couplove</h3></div>
        <div className="nav-activity-div">
        <div className="nav-activity logout"  onClick={()=>window.location.href = "/auth/logout"}>Logout</div> 
        {isHome&&<IconButton style={{color:"white"}} onClick={()=>document.getElementById('background-file').click()}><PhotoIcon/></IconButton>}
        {isHome&&<input type="file"  hidden id="background-file" onChange={handleChangeBackground} name="file"/>}
        <div className="nav-activity profile"  onClick={()=>window.location.href = "/userProfileForm"}>Profile</div> 
        {havePartner&&<div className="nav-activity chat" onClick={()=>window.open('/chatRoom','_self')}>Chat Room</div>}
        {havePartner&&<div className="nav-activity cinema" onClick={()=>window.open('/cinema','_self')}>Cinema</div>}
        {havePartner&&<div className="nav-activity memory" onClick={()=>window.open('/memoryBook','_self')}>Memory Book</div>}
        {!havePartner&&<div className="nav-sendRequest">
        <form onSubmit={handleSendReq} ref={formRef}>
        <input type="text" id="reqId" name="reqId" placeholder="Partner ID"/>
        <input type="submit" value="+" className="nav-submit" />
        </form>    
        </div>}
        {!havePartner&&<div className="nav-request">
        <IconButton style={{color:"whitesmoke"}} onClick={()=>setViewList(!viewList)}><PeopleAltIcon/></IconButton>
        {viewList&&<PartnerReq requestList={requestList} setHavePartner={setHavePartner} setRequestList={setRequestList} />}
        </div>}
        </div>
    </div>
}