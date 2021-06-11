import '../css/inputBox.css';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';

export default function InputBox(props)
{
    const {handleSendMsg} = props


    return<div className="foot">
        <form onSubmit={handleSendMsg} className="input-form">
        <input type="text" className="msg" placeholder="Type a message..." id="chat"/>
        <IconButton type="submit" id="sendIcon"><SendIcon/></IconButton>
        </form>
    
    </div>
}