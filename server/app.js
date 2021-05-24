require('dotenv').config({path: __dirname + '/./.env'});
require('./config/passport-setup');
const express = require('express');
const CLIENT_URL = "http://localhost:3000";
const session = require('express-session');
const cors = require("cors");
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const gridfsRoutes = require('./routes/gridFs');
const chatRoutes = require('./routes/chat');
const multer = require('multer');
const storage = require('./GridFsManger');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const mongoURI = "mongodb://localhost:27017/couplove";
const socket = require('socket.io');
const RoomModel = require('./models/roomModel');
const Chat = require('./entities/Chat');
const ChatManager = require('./dbmanagers/ChatManager');
const UserModel = require('./models/userModel');


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
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
}
})
io.on('connection', async(socket)=>{
  let userId;
  console.log("new connection");
  socket.on('join',async(data,callback)=>{
    userId = data.userId;
    roomId = data.roomId;
    const res1 = await RoomModel.findOne({userId:data.userId});
    const res2 = await RoomModel.findOne({partnerId:data.userId});
    if(!res1&&!res2)
    {
      return callback({status:"You are not allowed to join this room!"})
    }
    socket.join(String(data.roomId));

      
  });

  socket.on('sendMsg',async(msg)=>{
    console.log(msg);
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

  

    socket.on('disconnect',()=>{
      console.log("user dced!!");
    });

  });
  
  
app.use(methodOverride('_method'));





app.use('/auth',authRoutes);
app.use('/user',userRoutes);
app.use('/gridFs',gridfsRoutes);
app.use('/chat',chatRoutes);
