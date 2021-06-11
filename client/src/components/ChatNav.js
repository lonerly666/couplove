import '../css/chatNav.css';
import IconButton from '@material-ui/core/IconButton';
import VideocamIcon from '@material-ui/icons/Videocam';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PhotoIcon from '@material-ui/icons/Photo';
import { useEffect, useState,useRef } from 'react';
import axios from 'axios';

export default function ChatNav(props)
{
    const {toggleBackHome,partnerInfo,partnerStatus,toggleVideoCall,callAccepted,setBackgroundUrl} = props
	const [readyDisplay,setReadyDisplay] = useState(false);
	const [isOnline,setIsOnline] = useState(false);
	const [openMore,setOpenMore] = useState(false);


	const imgRef = useRef();

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
	

	async function toggleChangeBackground(event)
	{
		await axios.get('/chat/deleteBackground')
		const formdata = new FormData();
		formdata.append('file',event.target.files[0])
		await axios({
			method:'post',
			url:'/chat/uploadChatImg',
			data:formdata,
			headers:{'Content-Type': 'multipart/form-data'}
		})
		window.location.reload();
	}

    return<div className="chatNav-div">
		{isOnline&&<h1>ONLINE</h1>}
		{openMore&&<div className="chatNav-moreOption">
			<div className="chatNav-changeBackground" onClick={()=>document.getElementById('chatNav-file').click()}> 
				<PhotoIcon/>
				<input type="file" name="file" hidden id="chatNav-file" onChange={toggleChangeBackground}/>	
			</div>
		</div>}
        <div className="head">
				<div className="user">
					<div className="avatar" id="avatarStatus">
						<img src="/gridFs/getPartnerProfile" />
				</div>
					{readyDisplay&&<div className="name">{partnerInfo.nickname}</div>}
				</div>
				<ul id="bar_tool">
					<IconButton id="iconBtn" onClick={toggleVideoCall}><span className="alink"><VideocamIcon id="contact"/></span></IconButton>
					<IconButton id="iconBtn" onClick={()=>setOpenMore(!openMore)}><span className="alink"><MoreHorizIcon id="contact"/></span></IconButton>
				</ul>
			</div>
    </div>
}