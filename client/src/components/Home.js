import {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import ReactAvatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: "100%",
  },
  large: {
    width: theme.spacing(17),
    height: theme.spacing(17),
  },
}));
export default function Home()
{
  const [userInfo,setUserInfo] = useState();
  const classes = useStyles();
  const [imgUrl,setImgUrl] = useState();
    useEffect(() => {
        const ac = new AbortController();
        axios.get('/auth/isLoggedIn')
        .then(res =>res.data)
        .catch(err => console.log(err))
        .then(res => {
          if (res.isLoggedIn === false) {
            window.open('/login', '_self');
          } 
          else if(res.user.nickname===undefined||res.user.nickname===null||res.user.nickname==="")
          {
            window.open('/userProfileForm','_self');
          }
        })
        return function cancel() {
          ac.abort()
        }
      });

      function handleLogout()
      {
        window.location.href = "/auth/logout";
      }

    return <div>
        <ReactAvatar
            style={{borderStyle: "solid", borderColor: "#F0F2F5", borderWidth: "2px", margin: "auto"}}
            alt=""
            src ="/gridFs/getProfile"
            className={classes.large} 
         />
        <input type="submit" value="logout" onClick={handleLogout}/>
    </div>
}