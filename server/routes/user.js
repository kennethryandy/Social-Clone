const {Router} = require('express')
const multer = require('multer')

const User = require('../model/users')
const Like = require('../model/likes')
const Notification = require('../model/notifications')
const Post = require('../model/posts')
const Comment = require('../model/comments')

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname)
  }
})

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

//IMAGE UPLOAD
router.post('/uploadImage', upload.single('uploadImage'), async (req, res, next) => {
  if(!req.isAuth){
    const err = new Error('Unauthorized!')
    next(err)
  }
  try {
    const user = await User.findById(req.user.userId)
    await Comment.updateMany({userId: req.user.userId}, {$set: {imageUrl: req.file.path}})
    req.user.imageUrl = req.file.path
    if(user){
      user.imageUrl = req.file.path
      await user.save()
      await Notification.updateMany({senderId: req.user.userId}, {$set: {imageUrl: req.file.path}})
      res.status(201).json({message: 'Image uploaded successfully.'})
    }else{
      const err = new Error('User not found')
      res.status(404).json({message: err.message})
    }
  } catch (error) {
    next(error)
  }
})


//GET USERS
router.get('/', async (req, res, next) => {
  if(!req.isAuth){
    const err = new Error('Unauthorized!')
    res.status(401)
    next(err)
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
    next()
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
      next()
    }
  } catch (error) {
    res.status(500)
    next(error)
  }
})

router.get('/notification', async (req, res, next) => {
  if(!req.isAuth){
    const err = new Error('Unauthorized!')
    next(err)
  }
  try {
    await Notification.updateMany({recipient: req.user.userId}, {$set: {read: true}}).limit(10)
    res.status(200).json({message: 'Notifications marked read'})
  } catch (error) {
    res.status(500)
    next(error)
  }
})

router.post('/notifications', async (req, res, next) => {
  if(!req.isAuth){
    const err = new Error('Unauthenticated!')
    res.status(401)
    next(err)
  }
  try {
    await Notification.updateMany({userId: req.body.userId}, {read: true})
    res.json({
      message: "Marked notifications read"
    })
  } catch (error) {
    res.status(500)
    next(error)
  }

})


module.exports = router