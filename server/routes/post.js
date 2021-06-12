const router = require('express').Router();
const multer  = require('multer');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
// const mongoURI = "mongodb+srv://jeremy:JnJc0429@couplove.qvqnv.mongodb.net/Couplove?retryWrites=true&w=majority";
const mongoURI = process.env.DBURL;
const conn = mongoose.createConnection(mongoURI);
const PostManager = require('../dbmanagers/PostManager');
const Post = require('../entities/Post');
const UserManager = require('../dbmanagers/UserManager');
const methodOverride = require('method-override');
const postImageStorage = require('../GridFsPostImg');

let gfs;
router.use(methodOverride('_method'));
conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('postImage');
});
const upload = multer({storage:postImageStorage});

router.post('/createPost',upload.array('fileInput[]'),async(req,res)=>{
  let id=[];
  if(req.files)
  {
      for(let i=0;i<req.files.length;i++)
      {
        id.push(req.files[i].id);
      }
  }
    const post = new Post.Builder()
    .setUserId(req.user._id)
    .setText(req.body.text)
    .setUserNickname(req.user.nickname)
    .setTimeOfCreation(new Date())
    .setFileId(id)
    .setFeeling(req.body.feeling)
    .build();
    const result = await PostManager.createPost(post);
    res.send(result);
})

router.post('/getPosts',upload.none(),async(req,res)=>{
    const posts = await PostManager.getPosts(req.user._id,req.user.partner);
    res.send(posts);
})


router.get('/getPostImage/:fileId',upload.none(),async(req,res)=>{

  const id = new mongoose.mongo.ObjectId(req.params.fileId)
  gfs.files.findOne({_id:id},(err,file)=>{
    if (!file || file.length === 0) {
        res.send(null);
        return null;
      }

        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
 
  })  
});


router.post('/editPost',upload.array('fileInput[]'),async(req,res)=>{
  // console.log(req.body);
  const existingFileId = req.body.fileInput?req.body.fileInput:[];
  const newFileId =[];
  if(req.body.deletedFile)
  {
      for(let i =0;i<req.body.deletedFile.length;i++)
      {
        let id = new mongoose.mongo.ObjectId(req.body.deletedFile[i]);
            gfs.remove({ _id: id, root: 'postImage' }, (err, gridStore) => {
              if (err) {
                return res.status(404).json({ err: err });
              }
            });
      }
  }
  if(req.files.length>0)
  {
    for(let i=0;i<req.files.length;i++)
    {
      existingFileId.push(req.files[i].id);
      newFileId.push(req.files[i].id);
    }
  }
  const post = new Post.Builder()
  .setFileId(existingFileId)
  .setText(req.body.text)
  .setFeeling(req.body.feeling)
  const editedPost = await PostManager.editPost(req.body.postId,post);
  if(editedPost.status)
  {
    res.send({
      result:editedPost,
      fileId:newFileId  
    });
  }
  else
  {
    res.send(null);
  }
});

router.post('/deletePost',upload.none(),async(req,res)=>{
  if(req.body.fileId)
  {
    for(let i =0;i<req.body.fileId.length;i++)
    {
      let id = new mongoose.mongo.ObjectId(req.body.fileId[i]);
      gfs.remove({ _id: id, root: 'postImage' }, (err, gridStore) => {
        if (err) {
          console.log(err);
        }
      });
    }
  }
  const result = await PostManager.deletePost(req.body.postId)
  res.send(result);
})


module.exports = router;
