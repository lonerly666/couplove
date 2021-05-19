import {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import ReactAvatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

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
              setUserInfo({...res.user});
            }
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
      function handleChatClick()
      {
        window.open('/chatRoom','_self');
      }


    return <div>
        <div>
          <h1>CHAT</h1>
          <Button
          onClick = {handleChatClick}
          className="choiceBtn"
          userinfo={userInfo}
          >
          ENTER
          </Button>
        </div>
        <input type="submit" value="logout" onClick={handleLogout}/>
    </div>
}