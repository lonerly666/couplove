require('dotenv').config({path: __dirname + '/./.env'});
require('./config/passport-setup');
const express = require('express');
const session = require('express-session');
const cors = require("cors");
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);
const app = express();
const port = process.env.PORT || 5000;
const inProduction = process.env.NODE_ENV === "production";
const path = require('path');
const CLIENT_URL = inProduction ? process.env.DOMAIN_NAME : "http://localhost:3000";
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const gridfsRoutes = require('./routes/gridFs');
const chatRoutes = require('./routes/chat');
const videofsRoutes = require('./routes/videoFs');
const postRoutes = require('./routes/post');
const widgetRoutes = require('./routes/widget');
const homeRoutes = require('./routes/homeBackground');
const methodOverride = require('method-override');
const mongoURI = "mongodb+srv://jeremy:JnJc0429@couplove.qvqnv.mongodb.net/Couplove?retryWrites=true&w=majority";
const socket = require('socket.io');
const Chat = require('./entities/Chat');
const ChatManager = require('./dbmanagers/ChatManager');
const sslRedirect = require('heroku-ssl-redirect').default;
const users=[];

if (inProduction) {
  app.use(sslRedirect());
  app.use(express.static('client/build'))
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'));
  })
}


 mongoose.connect(mongoURI,{
  useNewUrlParser:true,
  useUnifiedTopology:true
});
mongoose.set("useCreateIndex", true);
mongoose.set('useFindAndModify', false);




app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });


const sessionMiddleware = session({
  cookie: {httpOnly:false},
  secret: "eet2jd883dx",
  key: 'connect.sid',
  resave: true,
  saveUninitialized: true, 
  store: sessionStore
});

app.use(cookieParser());
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());
app.use(
    cors({
      origin: CLIENT_URL,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true
    })
);
const server = app.listen(port);
const io = socket(server,{
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"]
}
})
io.on('connection', async(socket)=>{
  let roomId;
  console.log("new connection");
  
  socket.on('join',async(data,callback)=>{
    roomId = data.roomId;
    socket.join(String(data.roomId));
    await users.push({id:socket.id,roomId:roomId});
    let track=[];
    users.map(user=>{
      if(user.roomId===roomId)
      {
        track.push(user);
      }
    })
    io.to(String(data.roomId)).emit('me',{id:socket.id,users:track});
  });

  socket.on('sendMsg',async(msg)=>{
    let chat;
    let createdChat;
    const timeOfCreation = new Date();
    chat = new Chat.Builder()
    .setRoomId(msg.roomId)
    .setText(msg.msg)
    .setTimeOfCreation(timeOfCreation)
    .setUserId(msg.userId)
    .setUserNickname(msg.userNickname)
    .build();
    createdChat = await ChatManager.createChat(chat);
    io.to(String(msg.roomId)).emit('chatMsg',{
      _id:createdChat._id,
      text:msg.msg,
      userId:msg.userId,
      userNickname:msg.userNickname,
      timeOfCreation:timeOfCreation
    });
    
  });

  socket.on('calling',e=>{
    let current=[];
    users.map(user=>{
      if(user.roomId===roomId)
      {
         current.push(user);
      }
    })
    if(current.length>1)
    {
    io.to(String(roomId)).emit('start');
    io.to(socket.id).emit('startCalling');
    }
    else
    {
      io.to(socket.id).emit('no');
    }
  })

    socket.on('disconnect',()=>{
      
      for(let i =0;i<users.length;i++)
      { 
        if(users[i].id===socket.id)
        {
          users.splice(i);
        }
      }
      io.to(String(roomId)).emit('dc',{id:socket.id,users:users});
      io.to(String(roomId)).emit('returnDiv');
      socket.broadcast.emit("callended");
      console.log("user dced!!");
    });

    
   
    socket.on("calluser",({signalData,name})=>{
      let toCall;
      users.map(user=>{
        if(user.roomId===roomId&&user.id!==socket.id)
        {
          toCall = user.id;
        }
      })
      let userToCall = toCall;
      io.to(socket.id).emit('moveDiv');
      let from = socket.id;
      io.to(userToCall).emit("calluser",{from,name,signal:signalData});
    });   


    socket.on("answercall",(data)=>{
      io.to(data.to).emit("callaccepted",data.signal);
    });

    socket.on('changeVideoState',state=>{
      io.to(String(roomId)).emit('changeState',!state);
    })
    socket.on('keepUpdate',time=>{
      io.to(String(roomId)).emit('update',time);
    })
    socket.on('changeProgress',pointed=>{
      io.to(String(roomId)).emit('updateProgress',pointed);
    })

    socket.on('onlineUrl',data=>{
      io.to(String(roomId)).emit('onlineUrl',data);
    })
    socket.on('deletedVideo',e=>{
      io.to(String(roomId)).emit('refreshPage');
    })
  });

  
  
app.use(methodOverride('_method'));





app.use('/auth',authRoutes);
app.use('/user',userRoutes);
app.use('/gridFs',gridfsRoutes);
app.use('/chat',chatRoutes);
app.use('/videoFs',videofsRoutes);
app.use('/widget',widgetRoutes);
app.use('/post',postRoutes);
app.use('/home',homeRoutes);