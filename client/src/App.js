import { Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import UserProfileForm from './components/UserProfileForm';
import ChatRoom from './components/ChatRoom';
import './App.css';

export default function App(props) {
  return (
    <main>
      <Switch>
        <Route path="/" exact component={Home}/>
        <Route path="/login" exact component={Login}/>
        <Route path="/userProfileForm" exact component={UserProfileForm}/>
        <Route path="/chatRoom" exact component={ChatRoom}/>
      </Switch>
    </main>
  )
}
