require('dotenv').config({path: __dirname + '/../.env'});
const router = require('express').Router();
const passport = require('passport');
const inProduction = process.env.NODE_ENV === "production";
const CLIENT_URL = inProduction ? process.env.DOMAIN_NAME : "http://localhost:3000";
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const mongoURI = process.env.DBURL;
const storage = require('../GridFsManger');
const conn = mongoose.createConnection(mongoURI);
const UserModel = require('../models/userModel');
const WidgetManager = require('../dbmanagers/WidgetManager');

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('profileImg');
});




router.get("/google",
  passport.authenticate('google', { scope: ["profile", "email"] })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_URL);
});

router.get("/google/couplove",
  passport.authenticate('google', { failureRedirect: CLIENT_URL, successRedirect: CLIENT_URL })
);

router.get("/isLoggedIn", async (req, res) => {
if(req.user){
  let partner;
  let widget;
  if(req.user.partner!==null)
  {
     partner = await UserModel.findById(req.user.partner);
     widget = await WidgetManager.getWidget(req.user._id);
  }
 gfs.files.findOne({metadata:req.user._id},(err,files)=>{   
         res.send({
           files:files,
           user: req.user,
           isLoggedIn: true,
           partnerInfo:partner?partner:null,
           widget:widget?widget:null,
         })
    })

  } else {
    res.send({
      user: false,
      isLoggedIn: false,
    });
  }
})

module.exports = router;