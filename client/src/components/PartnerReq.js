import '../css/requestList.css';

import RequestInfo from './RequestInfo';




export default function PartnerReq(props)
{
    const {requestList,setHavePartner} = props;
    

    return<div className="req-list-div">
        {requestList.map(info=>{
            return <RequestInfo reqInfo={info} setHavePartner={setHavePartner}/>
        })}
    </div>
}