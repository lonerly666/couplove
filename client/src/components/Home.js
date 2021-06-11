import {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Navbar from '../components/Navbar';
import '../css/home.css';
import { IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';



export default function Home()
{
  const [userInfo,setUserInfo] = useState();
  const [partnerInfo,setPartnerInfo]= useState();
  const [havePartner,setHavePartner] = useState(false);
  const [requestList,setRequestList]= useState([]);
  const [dayWidget,setDayWidget] = useState(false);
  const [specialWidget,setSpecialWidget] = useState(false);
  const [bdayWidget,setBdayWidget] = useState(false);
  const [dateOfRelation,setDateOfRelation] = useState(false);
  const [isSetting,setIsSetting] = useState(false);
  const [totalDay,setTotalDay] = useState();
  const [userBday,setUserBday] = useState();
  const [partnerBday,setPartnerBday] = useState();
  const [yourCountDown,setYourCountDown] = useState();
  const [partnerCountDown,setPartnerCountDown] = useState();
  const [upComingEvent,setUpComingEvent] = useState();
  const [upComingDay,setUpComingDay] = useState();
  const [backgroundUrl,setBackgroundUrl] = useState('');
  const [isHome,setIsHome] = useState(true);

  const formRef = useRef();
  const acceptRef = useRef();
  const dateRef = useRef();
  

  const monthMap = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December",
  }



    useEffect(() => {
        const ac = new AbortController();
        axios.get('/auth/isLoggedIn')
        .then(res =>res.data)
        .catch(err => console.log(err))
        .then(res => {
          if (res.isLoggedIn===false)
          {
             window.open('/login','_self');
          }
          else
          {
            if(res.user.nickname===undefined)
            {
              window.open('/userProfileForm','_self');
            }
            else
            {

              axios.get('/home/getBackground')
              .then(res=>res.data)
              .catch(err=>console.log(err))
              .then(res=>{
                if(!res)
                {
                  setBackgroundUrl('https://s3-us-west-2.amazonaws.com/s.cdpn.io/751678/my-illustration-background.png');
                  document.getElementById('foreground').style.visibility="visible";
                }
                else
                {
                  setBackgroundUrl('/home/getBackground');
                  document.getElementById('foreground').style.visibility="hidden";
                }
              })

              let anniverse = new Date(res.user.dateOfRelationship);
              let month = anniverse.getMonth()+1;
              let day = anniverse.getDate();
              let date ="0"+ month+"/"+day;
              const specialEvent = [
                {date:"02/14",event:"Valentines Day"},
                {date:"05/20",event:"520 Day"},
                {date:"12/25",event:"Christmas Day"},
                {date:"12/31",event:"New Year Eve"},
                {date:date,event:"Anniversary Day"},
           
             ]

              setPartnerInfo(res.partnerInfo);
              setUserInfo(res.user);
              if(res.user.dateOfRelationship!==null)
              {
                setDateOfRelation(true);
                setDate(res.user.dateOfRelationship);
                if(res.widget)
                {
                    for(let i=0;i<res.widget.widget.length;i++)
                    {
                      if(res.widget.widget[i].type==="day")
                      {
                        setDayWidget(true);
                        let current = new Date();
                        let original = new Date(res.user.dateOfRelationship);
                        let difference = current.getTime()-original.getTime();
                        let day = difference/ (1000 * 3600 * 24);
                        setTotalDay(parseInt(day)+1);
                      }
                      else if(res.widget.widget[i].type==="bday")
                      {
                        
                        const partner = formatDate(res.partnerInfo.dateOfBirth);
                        const you = formatDate(res.user.dateOfBirth);
                        setPartnerBday(partner);
                        setUserBday(you);
                        const current = new Date();
                        const date1 = new Date(res.partnerInfo.dateOfBirth);
                        const date2 = new Date(res.user.dateOfBirth);
                        date1.setFullYear(current.getFullYear());
                        date2.setFullYear(current.getFullYear());
                        if(current>date1)
                        {
                          date1.setFullYear(current.getFullYear()+1);
                        }
                        if(current>date2)
                        {
                          date2.setFullYear(current.getFullYear()+1);
                        }
                        const temp1 = parseInt((date1.getTime()-current.getTime())/ (1000 * 3600 * 24));
                        const temp2 = parseInt((date2.getTime()-current.getTime())/ (1000 * 3600 * 24));
                        if(temp1===0)
                        {
                          setPartnerCountDown("Today is your partner's Birthday!");
                        }
                        else{
                          setPartnerCountDown(Math.abs(temp1));
                        }
                        if(temp2===0)
                        {
                          setYourCountDown("Today is your Birthday!")
                        }
                        else
                        {
                           setYourCountDown(Math.abs(temp2));
                        }
                        setBdayWidget(true);
                      }
                      else if(res.widget.widget[i].type==="special")
                      {
                        setSpecialWidget(true);
                        const currentDate = new Date();
                        const currentYear = currentDate.getFullYear();
                        let closest =99999999999;
                        specialEvent.map(date=>{
                          let temp = new Date(currentYear+"/"+date.date);
                          if(currentDate>temp)
                          {
                            temp.setFullYear(currentDate+1);
                          }
                          let result = Math.abs((parseInt(currentDate.getTime()-temp.getTime())/ (1000 * 3600 * 24)));
                          if(result<closest)
                          {
                            closest = result+1;
                            setUpComingEvent(date.event);
                          }
                        })
                        if(Math.round(closest)===0)
                        {
                          setUpComingDay("Today is "+date.event+" !");
                        }
                        else
                        {
                          setUpComingDay(Math.round(closest));
                        }
                        
                        
                      }
                    }
                }
              }
              axios({
                method:'get',
                url:'/user/getRequest',
                headers: {'Content-Type': 'multipart/form-data'}
              })
              .then(res=>res.data)
              .catch(err=>console.log(err))
              .then(res=>{
                let temp=[];
                res.requests.map(list=>{
                  temp.push({...list});
                })
                setRequestList(temp);
              })
              if(res.user.partner!==null)
              {
                setHavePartner(true); 
              }
             
            }
          } 
        })
        return function cancel() {
          ac.abort()
        }
      },[dayWidget,specialWidget,bdayWidget]);

      
      function formatDate(date) {
        const today = new Date(parseInt(Date.parse(date), 10));
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        // return mm + '/' + dd + '/' + yyyy;
        return dd + " " + monthMap[mm] 
      }
      function handleLogout()
      {
        window.location.href = "/auth/logout";
      }
      function handleSendReq(event)
      {
        event.preventDefault();
        const formData = new FormData(formRef.current);
        axios({
          method:'post',
          url:'/user/sendRequest',
          data:formData,
          headers: {'Content-Type': 'multipart/form-data'}
        })
        .then(res=>res.data)
        .catch(err=>console.log(err))
        .then(res=>{
          if(res.isSent)
          {
             alert("sent!");
          }
          else
          {
            alert(res.status);
            console.log(res)
          }
        })
        document.getElementById('reqId').value = "";
      }
      requestList.map(list=>{
        console.log(list);
      })

      

      function onHoverAddWidget(type)
      {
        if(type==="special")
        {
          document.getElementById('hover-special').style.opacity="1";
        }
        else if(type==="day")
        {
          document.getElementById('hover-day').style.opacity="1";
        }
        else if(type==="bday")
        {
          document.getElementById('hover-bday').style.opacity="1";
        }
      }

      function offHoverAddWidget(type)
      {
        if(type==="special")
        {
          document.getElementById('hover-special').style.opacity="0";
        }
        else if(type==="day")
        {
          document.getElementById('hover-day').style.opacity="0";
        }
        else if(type==="bday")
        {
          document.getElementById('hover-bday').style.opacity="0";
        }
      }

      async function handleCreateWidget(type)
      {
        if(type==="day")
        {
          if(dateOfRelation)
          {
            const formdata = new FormData();
            formdata.append('type',type);
            await axios({
              method:'post',
              url:'/widget/createWidget',
              data:formdata,
              headers:{'Content-Type': 'multipart/form-data'}
            })
            .then(res=>res.data)
            .catch(err=>console.log(err))
            .then(res=>{
              setDayWidget(true);
            })  
          }
          else
          {
            document.getElementById("noDayWidget").style.display="none";
            setIsSetting(true);
          }
        }
        else if(type==="bday")
        {
          const formdata = new FormData();
          formdata.append('type',"bday");
          await axios({
            method:'post',
            url:'/widget/createWidget',
            data:formdata,
            headers:{'Content-Type': 'multipart/form-data'}
          })
          .then(res=>res.data)
          .catch(err=>console.log(err))
          .then(res=>{
            if(res)
            {
              setBdayWidget(true);
            }
          })
        }
        else if(type==="special")
        {
          const formdata = new FormData();
          formdata.append('type',"special");
          await axios({
            method:'post',
            url:'/widget/createWidget',
            data:formdata,
            headers:{'Content-Type':'multipart/formdata'}
          })
          .then(res=>res.data)
          .catch(err=>console.log(err))
          .then(res=>{
            if(res)
            {
              setSpecialWidget(true);
            }
          })
        }
      }

      async function handleUpdateDate(event)
      {
        event.preventDefault();
        const formdata = new FormData(dateRef.current);
        formdata.append('type',"day");
        await axios({
          method:'post',
          url:'/widget/createWidget',
          data:formdata,
          headers:{'Content-Type': 'multipart/form-data'}
        })
        .then(res=>res.data)
        .catch(err=>console.log(err))
        .then(res=>{
          setIsSetting(false);
          setDayWidget(true);
        })
      }

      function onHoverWidget(type)
      {
        if(type==="day")
        {
          document.getElementById("home-delete-dayWidget").style.visibility = "visible";
        }
        else if(type==="bday")
        {
          document.getElementById('home-delete-bdayWidget').style.visibility = "visible";
        }
        else if(type==="special")
        {
          document.getElementById('home-delete-specialWidget').style.visibility = "visible";
        }
      }
      function offHoverWidget()
      {
        if(dayWidget)
        document.getElementById("home-delete-dayWidget").style.visibility = "hidden";
        if(bdayWidget)
        document.getElementById('home-delete-bdayWidget').style.visibility ="hidden";
        if(specialWidget)
        document.getElementById('home-delete-specialWidget').style.visibility = "hidden";
      }

      async function handleDeleteWidget(type)
      {
         const formdata = new FormData();
         formdata.append('type',type);
         await axios({
           method:'post',
           url:'/widget/deleteWidget',
           data:formdata,
           headers:{'Content-Type': 'multipart/form-data'}
         })
         .then(res=>res.data)
         .catch(err=>console.log(err))
         .then(res=>{
           if(res)
           {
             if(type==="day")
             setDayWidget(false)
             if(type==="bday")
             setBdayWidget(false)
             if(type==="special")
             setSpecialWidget(false)
           }
         })
      }


    return <div className="home-div">
      <Navbar isHome={isHome} setRequestList={setRequestList} setHavePartner={setHavePartner}  requestList={requestList} havePartner={havePartner} handleSendReq={handleSendReq} formRef = {formRef} handleLogout={handleLogout} handleSendReq={handleSendReq} acceptRef={acceptRef}/>
      <div className="home-background" style={{backgroundImage:"url("+backgroundUrl+")"}}>
        <div className="home-overlay">
            <div className="home-widget anniverse">
            {!havePartner&&<div className="home-noPartner">You need to have a partner to access this widget</div>}
            {specialWidget?
            <div className="home-event-div" onMouseOut={offHoverWidget} onMouseOver={()=>onHoverWidget("special")}>
              <IconButton id="home-delete-specialWidget" onClick={()=>handleDeleteWidget("special")}><ClearIcon/></IconButton>
              <div className="home-event-title">
                <h3>Up Coming Event:</h3><br/>
                <h1>{upComingEvent}</h1>
              </div>
              <div className="home-event-day">
              <h1>{upComingDay} days left</h1>
              </div>
            </div>
            :
            <div className="home-noWidget">
              <IconButton id="home-add-widget" onClick={()=>handleCreateWidget("special")} onMouseOver={()=>onHoverAddWidget("special")} onMouseOut={()=>offHoverAddWidget("special")}><AddIcon fontSize="large"/></IconButton>
              <div className="home-add-hover" id="hover-special">Add this widget to get to know up coming special events</div>
            </div>}
            </div>
            <div className="home-widget days">
            {!havePartner&&<div className="home-noPartner">You need to have a partner to access this widget</div>}
            {dayWidget?
            <div className="home-totalDay-widget"  onMouseOut={offHoverWidget} onMouseOver={()=>onHoverWidget("day")}><IconButton id="home-delete-dayWidget" onClick={()=>handleDeleteWidget("day")}><ClearIcon/></IconButton><h1>{totalDay} DAYS</h1></div>
            :
            <div className="home-noWidget"  id="noDayWidget">
              <IconButton id="home-add-widget"  onClick={()=>handleCreateWidget("day")} onMouseOver={()=>onHoverAddWidget("day")} onMouseOut={()=>offHoverAddWidget("day")}><AddIcon fontSize="large"/></IconButton>
              <div className="home-add-hover" id="hover-day">Add this widget to get to know total days together</div>
            </div>}
            {isSetting&&<div className="home-setDate">
              <div className="home-setDate-title"><h2>Please set the date of you with your partner</h2></div>
            <form onSubmit={handleUpdateDate} ref={dateRef}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              id="dateOfRelation"
              label="Date of Relationship"
              name="dateOfRelation"
              format="MM/dd/yyyy"
              value={date}
              onChange={(date) => {setDate(date)}}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
          <Button type="submit" id="home-submit-day">SUBMIT</Button>
          </form>
            </div>}
            </div>
            <div className="home-widget special">
              {!havePartner&&<div className="home-noPartner">You need to have a partner to access this widget</div>}
            {bdayWidget?
            <div className="home-dob-div" onMouseOut={offHoverWidget} onMouseOver={()=>onHoverWidget("bday")}>
              <IconButton id="home-delete-bdayWidget" onClick={()=>handleDeleteWidget("bday")}><ClearIcon/></IconButton>
              <div className="home-bday-div you">
              <div className="home-bday-name"><h1>{userInfo.nickname}</h1></div>
                <div className="home-bday-border">
                  <div className="home-bday-calander">
                    <h2 style={{borderBottom:"1px solid white"}}>{userBday}</h2><br/><br/><br/>
                    <h1>{yourCountDown} days left</h1>
                  </div>
                </div>
              </div>
              <div className="home-bday-div partner">
              <div className="home-bday-name"><h1>{partnerInfo.nickname}</h1></div>
                <div className="home-bday-border">
                  <div className="home-bday-calander">
                    <h2 style={{borderBottom:"1px solid white"}}>{partnerBday}</h2><br/><br/><br/>
                    <h1>{partnerCountDown} days left</h1>
                  </div>
                </div>
              </div>

            </div>
            :
            <div className="home-noWidget">
              <IconButton id="home-add-widget" onClick={()=>handleCreateWidget("bday")} onMouseOver={()=>onHoverAddWidget("bday")} onMouseOut={()=>offHoverAddWidget("bday")}><AddIcon fontSize="large"/></IconButton>
              <div className="home-add-hover" id="hover-bday">Add this widget to get to know each other birthdays</div>
            </div>}
            </div>

        </div>
            <div className="foreground" id="foreground"></div>
      </div>

    </div>
    
}