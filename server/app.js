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
const multer = require('multer');
const storage = require('./GridFsManger');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const mongoURI = "mongodb://localhost:27017/couplove";

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


app.use(methodOverride('_method'));





app.use('/auth',authRoutes);
app.use('/user',userRoutes);
app.use('/gridFs',gridfsRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
