import {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import '../css/profileInfo.css';
import ReactAvatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import IconButton from '@material-ui/core/IconButton';

const genders = [
    {
      value: 'male',
      label: 'male',
    },
    {
      value: 'female',
      label: 'female',
    },
  ];

  const useStyles = makeStyles((theme) => ({
    formControl: {
      marginTop:20,
      minWidth: "90%",
    },
  }));
export default function UserProfileForm()
{
    const [nickname,setNickname] = useState("");
    const [bio,setBio] = useState("");
    const [croppedUrl, setCroppedUrl] = useState();
    const [uploaded,setUploaded] = useState(false);
    const [dob,setDob] = useState(new Date());
    const [gender,setGender] = useState('male');
    const [newProfile,setNewProfile]=useState(false);
    const [partner,setPartner] = useState();
    const [dateOfRelationship,setDateOfRelationship] = useState();
    const formRef = useRef();
    const classes = useStyles();

    useEffect(() => {
        const ac = new AbortController();
        axios.get('/auth/isLoggedIn')
        .then(res =>res.data)
        .catch(err => console.log(err))
        .then(res => {
          if (res.isLoggedIn === false) {
            window.open('/login', '_self');
          } 
          else if(res.user.nickname)
          {
            setNickname(res.user.nickname);
            setDob(res.user.dateOfBirth);
            setGender(res.user.gender);
            setBio(res.user.bio);
            if(res.user.partner!==null)
            {
            setPartner(res.user.partner);
            if(res.user.dateOfRelationship)
            {
                setDateOfRelationship(res.user.dateOfRelationship);
            }
            }
          }
        })
        return function cancel() {
          ac.abort()
        }
      },[]);
      useEffect(() => {
        const ac = new AbortController();
      axios({
        method:'get',
        url:'/gridFs/checkExists',
        headers: {'Content-Type': 'multipart/form-data'}
      })
      .then(res=>res.data)
      .catch(err=>console.log(err))
      .then(res=>{
        if(res===true)
        {
           document.getElementById("overlay").style.visibility="hidden";
        }
      })
      return function cancel() {
        ac.abort()
      }
    },[]);
      if(uploaded)
      {
        const reader = new FileReader();
        reader.onload = function(event){
          if(event.target.result===null)
          {
            return;
          }
          document.getElementById("avatarImg").setAttribute("src",event.target.result);
        }
        reader.readAsDataURL(croppedUrl);
       
      }
      async function handleSubmit(event) {
        if(uploaded){axios.get('/gridFs/deleteImg');}
        event.preventDefault();
        
        const formData = new FormData(formRef.current); 
        partner&&formData.append('partner',partner);
         await  axios({
            method:'post',
            url:'/user/info',
            data:formData,
            headers: {'Content-Type': 'multipart/form-data'}
          })
          window.location.href = "/";
      }

      function toggleNewFile(event)
      {
        const file = event.target.files[0];
         if(file===undefined)
        {
          return;
        }
        else
        {
         document.getElementById("overlay").style.visibility="hidden";
         setCroppedUrl(file);
         setUploaded(true);
        }
      }
      
      function uploadFile()
      {
         document.getElementById("file").click();
      }

    return <div className="infoForm" id="infoForm">
        
    <form onSubmit={handleSubmit} ref={formRef}>
      <div id="avatar">
       <ReactAvatar
        id="overlay"
      />
       <img src={uploaded?"":"/gridFs/getProfile"} id="avatarImg"/>
      </div>
      <div className="fileIpt">
          <input type="file" name="file" id="file" onChange={toggleNewFile}/>
          <IconButton
          id="uploadBtn"
          onClick={uploadFile}
          >
            <AddAPhotoIcon/>
          </IconButton>
      </div>
          <br/>
          <div className="infoDiv">
            <TextField
            id="nickname"
            className="inputFields"
            label="Nickname"
            variant="outlined"
            name="nickname"
            value={nickname}
            onChange={(e) => {setNickname(e.target.value)}}/>
            <br/>
            <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Gender</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={gender}
              onChange={(e) => {setGender(e.target.value)}}
              label="Gender"
              name="gender"
            >
              {genders.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl> 
          <br />
          <MuiPickersUtilsProvider utils={DateFnsUtils} style={{marginLeft:"10px"}}>
            <KeyboardDatePicker
              margin="normal"
              id="dateOfBirth"
              label="Date of birth (mm/dd/yyyy)"
              name="dateOfBirth"
              format="MM/dd/yyyy"
              value={dob}
              onChange={(date) => {setDob(date)}}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
          {dateOfRelationship&&<MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              id="dateOfRelation"
              label="Date of relationship"
              name="dateOfRelationship"
              format="MM/dd/yyyy"
              value={dateOfRelationship}
              onChange={(date) => {setDateOfRelationship(date)}}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>}
          
          <br/>    
        
     
          <TextField
            id="bio"
            label="Bio"
            variant="outlined"
            name="bio"
            className="inputFields"
            value={bio}
            onChange={(e) => {setBio(e.target.value)}}/>
            <br/>
            
          <Button type="submit" id="submitInfo">
              submit
          </Button>
          </div>
        </form>
    </div>
}