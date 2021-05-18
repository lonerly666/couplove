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
    large: {
      width: theme.spacing(19),
      height: theme.spacing(19),
    },
  }));
export default function UserProfileForm()
{
    const [nickname,setNickname] = useState("");
    const [bio,setBio] = useState("");
    const [croppedUrl, setCroppedUrl] = useState();
    const [dob,setDob] = useState(new Date());
    const [gender,setGender] = useState('male');
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
          }
        })
        return function cancel() {
          ac.abort()
        }
      });

      async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(formRef.current);
        await axios({
          method:'post',
          url:'/user/info',
          data:formData,
          headers: {'Content-Type': 'multipart/form-data'}
        })
        window.location.href = "/";
      }

    return <div className="infoForm">
        
    <form onSubmit={handleSubmit} ref={formRef}>
    <ReactAvatar
            style={{borderStyle: "solid", borderColor: "#F0F2F5", borderWidth: "2px", margin: "auto"}}
            alt="user profile"
            src={croppedUrl}
            id="avatar"
            className={classes.large} />
          <input type="file" name="file" id="file"/>
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
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
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