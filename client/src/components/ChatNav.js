import '../css/chatNav.css';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import VideocamIcon from '@material-ui/icons/Videocam';
import PhoneIcon from '@material-ui/icons/Phone';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useEffect, useState } from 'react';

export default function ChatNav(props)
{
    const {toggleBackHome,partnerInfo,partnerStatus} = props
	const [readyDisplay,setReadyDisplay] = useState(false);
	const [isOnline,setIsOnline] = useState(false);
	useEffect(()=>{
		const ac = new AbortController();
		if(partnerInfo)
		{
			setReadyDisplay(true);
		}
		return function cancel() {
            ac.abort();
          }
	},[partnerInfo])

		if(partnerStatus&&partnerInfo)
		{
			partnerStatus.map(user=>{
				if(user===partnerInfo._id)
				{	
					setIsOnline(true);
				}
			})
		}
	
    return<div className="chatNav-div">
		{isOnline&&<h1>ONLINE</h1>}
        <div className="head">
        <IconButton id="backBtn" onClick={toggleBackHome}><ArrowBackIcon/></IconButton> 
				<div className="user">
					<div className="avatar" id="avatarStatus">
						<img src="/gridFs/getPartnerProfile" />
				</div>
					{readyDisplay&&<div className="name">{partnerInfo.nickname}</div>}
				</div>
				<ul id="bar_tool">
					<IconButton id="iconBtn"><span className="alink"><PhoneIcon id="contact"/></span></IconButton>
					<IconButton id="iconBtn"><span className="alink"><VideocamIcon id="contact"/></span></IconButton>
					<IconButton id="iconBtn"><span className="alink"><MoreHorizIcon id="contact"/></span></IconButton>
				</ul>
			</div>
    </div>
}