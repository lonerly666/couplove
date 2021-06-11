
import '../css/chatBubble.css';


export default function ChatBubble(props)
{
    const{textInfo,user}= props;
    if(textInfo&&textInfo.userId===user._id)
    {       
        return<div className="bubble-div righter">
           <div className = "context">
            <p>{textInfo&&textInfo.text}</p>
           </div>
        </div>
    }
    else{
        return<div className="bubble-div lefter">
            <div className="img-div">
            <img src="/gridFs/getPartnerProfile"/>
            </div>
            <div className = "context">
            <p>{textInfo&&textInfo.text}</p>
           </div>
        </div>
    }
}