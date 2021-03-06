const {Router} = require('express')

const router = Router()

const Like = require('../model/likes')
const Notification = require('../model/notifications')
const Post = require('../model/posts')
const Comment = require('../model/comments')

router.get('/:postId', async (req, res, next) => {
  if(!req.isAuth){
    const err = new Error('Unauthenticated!')
    return next(err)
  }
  try {
    const populateQuery = [{path:'creator', select:'username imageUrl bio location status'}, {path:'comments', select:'content createdAt -_id'}];
    const post = await Post.findById(req.params.postId).populate(populateQuery)
    res.json({post})
  } catch (error) {
    return next(error.message)
  }
});

router.delete('/:postId', async (req, res, next) => {
  if(!req.isAuth){
    const err = new Error('Unauthenticated!')
    return next(err)
  }
  try {
    await Post.deleteOne({_id: req.params.postId})
    await Notification.deleteMany({postId: req.params.postId})
    await Like.deleteMany({post:req.params.postId})
    await Comment.deleteMany({post: req.params.postId})
    res.json({message: "Post deleted successfully."})
  } catch (error) {
    return next(error)
  }
})




module.exports = router