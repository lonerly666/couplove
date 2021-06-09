import '../css/navbar.css';

import PartnerReq from  './PartnerReq';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import { IconButton } from '@material-ui/core';
import { useState } from 'react';

export default function Navbar(props)
{
    const {handleSendReq,formRef,handleLogout,acceptPartner,acceptRef,havePartner,requestList,setHavePartner} = props;
    const [viewList,setViewList] = useState(false);

    return<div className="nav-div">
        <div className="nav-title" onClick={()=>window.open('/','_self')}><h3>Couplove</h3></div>
        <div className="nav-activity-div">
        <div className="nav-activity logout"  onClick={()=>window.location.href = "/auth/logout"}>Logout</div> 
        <div className="nav-activity profile"  onClick={()=>window.location.href = "/userProfileForm"}>Profile</div> 
        {havePartner&&<div className="nav-activity chat" onClick={()=>window.open('/chatRoom','_self')}>Chat Room</div>}
        {havePartner&&<div className="nav-activity cinema" onClick={()=>window.open('/cinema','_self')}>Cinema</div>}
        {havePartner&&<div className="nav-activity memory" onClick={()=>window.open('/memoryBook','_self')}>Memory Book</div>}
        {!havePartner&&<div className="nav-sendRequest">
        <form onSubmit={handleSendReq} ref={formRef}>
        <input type="text" id="reqId" name="reqId" placeholder="Partner ID"/>
        <input type="submit" value="+" className="nav-submit"/>
        </form>    
        </div>}
        {!havePartner&&<div className="nav-request">
        <IconButton style={{color:"whitesmoke"}} onClick={()=>setViewList(!viewList)}><PeopleAltIcon/></IconButton>
        {viewList&&<PartnerReq requestList={requestList} setHavePartner={setHavePartner}/>}
        </div>}
        </div>
        
       

        {/* <form onSubmit={acceptPartner} ref={acceptRef}>
        <input type="text" id="reqId" name="senderId"/>
        <input type="submit"/>
        </form> */}
        
    </div>
}