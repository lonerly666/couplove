import { Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import UserProfileForm from './components/UserProfileForm';
import ChatRoom from './components/ChatRoom';
import {ContextProvider} from './SocketContext';
import Cinema from './components/Cinema';
import MemoryBook from './components/MemoryBook/MemoryBook';
// import './App.css';

export default function App(props) {
  return (
    <main>
      <Switch>
        <Route path="/" exact component={Home}/>
        <Route path="/login" exact component={Login}/>
        <Route path="/userProfileForm" exact component={UserProfileForm}/>
        <Route path="/cinema" exact component={Cinema}/>
        <Route path="/memoryBook" exact component={MemoryBook}/>
        <ContextProvider>
        <Route path="/chatRoom" exact component={ChatRoom}/>
        </ContextProvider>
      </Switch>
    </main>
  )
}
