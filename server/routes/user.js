const {Router} = require('express')
const path = require('path');
const multer = require('multer')
const crypto = require('crypto')
const mongoose = require('mongoose')
const User = require('../model/users')
const GridFsStorage = require('multer-gridfs-storage');
const Like = require('../model/likes')
const Notification = require('../model/notifications')
const Post = require('../model/posts')
const Comment = require('../model/comments')

const router = Router();

const conn = mongoose.connection
let gfs;

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex')+path.extname(file.originalname)
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    });
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true)
  }else{
    cb(new Error('Invalid file type'), false)
  }
}

const upload = multer({storage, limits:{
  fileSize: 1024 * 1024 * 5
}, fileFilter});


conn.once('open', () => {
  // Init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  });

  //Upload Image
  router.post('/uploadImage',upload.single('uploadImage'), async (req, res) => {
    if(!req.isAuth){
      const err = new Error('Unauthorized!')
      return next(err)
    }
    try {
      const user = await User.findById(req.user.userId)
      await Comment.updateMany({userId: req.user.userId}, {$set: {imageUrl: req.file.filename}})
      req.user.imageUrl = req.file.filename
      if(user){
        user.imageUrl = req.file.filename
        await user.save()
        await Notification.updateMany({senderId: req.user.userId}, {$set: {imageUrl: req.file.filename}})
        res.status(201).json({message: 'Image uploaded successfully.'})
      }else{
        const err = new Error('User not found')
        res.status(404).json({message: err.message})
      }
    } catch (error) {
      return next(error)
    }
  })
});

router.get("/img/:filename", (req, res) => {
  gfs
    .find({
      filename: req.params.filename
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          message: "no files exist",
          error: err
        });
      }
      gfs.openDownloadStreamByName(files[0].filename).pipe(res);
    });
});


//GET USERS
router.get('/', async (req, res, next) => {
  if(!req.isAuth){
    const err = new Error('Unauthorized!')
    res.status(401)
    return next(err)
  }
  let userData = {};
  const user = await User.findById(req.user.userId)
  const posts = await Post.find({creator: user}, null, {sort: '-createdAt'}).populate('comments')
  const likes = await Like.find({user: req.user.userId})
  const notif = await Notification.find({userId: req.user.userId})
  if(user){
    userData.credentials = {
      ...user._doc,
      password: null,
      posts
    }
    if(likes){
      userData.likes = [];
      likes.forEach(doc => {
        userData.likes.push(doc)
      })
    }
    if(notif){
      userData.notifications = [];
      notif.forEach(doc => {
        userData.notifications.push(doc)
      })
    }
    res.status(200).json(userData)
  }else{
    res.status(404)
    return next()
  }
})

//GET USER
router.get('/:userId', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
    const post = await Post.find({creator: req.params.userId}).sort('-createdAt').populate('comments').sort('-createdAt')
    let userData = {};
    if(user){
      userData = user
      if(post){
        userData.posts = []
        post.forEach(doc => {
          userData.posts.push(doc)
        })
      }
      res.status(200).json({
        ...userData._doc,
        password:null
      })
    }else{
      res.status(404)
      return next()
    }
  } catch (error) {
    res.status(500)
    return next(error)
  }
})

router.get('/notification', async (req, res, next) => {
  if(!req.isAuth){
    const err = new Error('Unauthorized!')
    return next(err)
  }
  try {
    await Notification.updateMany({recipient: req.user.userId}, {$set: {read: true}}).limit(10)
    res.status(200).json({message: 'Notifications marked read'})
  } catch (error) {
    res.status(500)
    return next(error)
  }
})

router.post('/notifications', async (req, res, next) => {
  if(!req.isAuth){
    const err = new Error('Unauthenticated!')
    res.status(401)
    return next(err)
  }
  try {
    await Notification.updateMany({userId: req.body.userId}, {read: true})
    res.json({
      message: "Marked notifications read"
    })
  } catch (error) {
    res.status(500)
    return next(error)
  }

})


module.exports = router