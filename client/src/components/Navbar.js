import '../css/navbar.css';


export default function Navbar(props)
{
    const {handleSendReq,formRef} = props;
    

    return<div className="nav-div">
        <form onSubmit={handleSendReq} ref={formRef}>
        <input type="text" id="reqId" name="reqId"/>
        <input type="submit"/>
        </form>

        
    </div>
}