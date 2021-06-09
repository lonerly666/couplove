import '../css/inputBox.css';
import SendIcon from '@material-ui/icons/Send';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import IconButton from '@material-ui/core/IconButton';

export default function InputBox(props)
{
    const {handleSendMsg} = props


    return<div className="foot">
        <form onSubmit={handleSendMsg} className="input-form">
        <InsertEmoticonIcon id="emoji-btn"/>
        <input type="text" className="msg" placeholder="Type a message..." id="chat"/>
        <IconButton type="submit" id="sendIcon"><SendIcon/></IconButton>
        </form>
    
    </div>
}