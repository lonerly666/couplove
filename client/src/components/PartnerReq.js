import '../css/requestList.css';

import RequestInfo from './RequestInfo';




export default function PartnerReq(props)
{
    const {requestList,setHavePartner,setRequestList} = props;
    

    return<div className="req-list-div">
        {requestList.map(info=>{
            return <RequestInfo setRequestList={setRequestList} reqInfo={info} setHavePartner={setHavePartner}/>
        })}
    </div>
}