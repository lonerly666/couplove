const router = require('express').Router();
const multer  = require('multer');
const upload = multer();
const UserManager = require('../dbmanagers/UserManager');
const User = require('../entities/User');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const storage = require('../GridFsManger');
const mongoURI = "mongodb://localhost:27017/couplove";
const conn = mongoose.createConnection(mongoURI);


// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('profileImg');
});
const profile = multer({storage:storage});
router.post('/info', profile.single('file'), async (req, res) => {
  // const profilePic = await GridFsManager.uploadProfilePic(req.body.profile,req.userId);
  const user =
      new User.Builder()
      .setNickname(req.body.nickname)
      .setDateOfBirth(new Date(req.body.dateOfBirth))
      .setGender(req.body.gender)
      .setBio(req.body.bio)
      .build();
  const updatedUser = await UserManager.saveInfo(req.user._id, user);
  
  res.end();
})

module.exports = router;