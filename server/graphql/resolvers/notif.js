const Comment = require('../../model/comments')
const Post = require('../../model/posts')
const Notification = require('../../model/notifications')
const Like = require('../../model/likes')
const User = require('../../model/users')
const {toDateString} = require('../../helpers/toDateString')
module.exports = {
  comments: async () => {
    try {
      const comments = await Comment.find().populate('post').populate('user')
      if(!comments) throw new Error('Comment not found')
      const resComment = comments.map(comment => ({
        _id: comment._id,
        userId: comment.user._id,
        username: comment.user.username,
        imageUrl: comment.user.imageUrl,
        postId: comment.post._id,
        content: comment.content,
        createdAt: toDateString(comment.createdAt),
        updatedAt: toDateString(comment.updatedAt)
      }))
      return resComment
    } catch (error) {
      throw error
    }
  },
  addComment: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Unauthorized!');
    }
    const {postId, content} = args.commentInput
    const post = await Post.findById(postId)
    try {
      if(post){
        const user = await User.findById(post.creator)
        const userSender = await User.findById(req.user.userId)
        let postCount = post.commentCount
        if(user.id !== req.user.userId){
          const newNotif = new Notification({
            recipient: user.username,
            sender: userSender.username,
            type:'comment',
            postId,
            userId: user._id,
            imageUrl: userSender.imageUrl,
            senderId: userSender._id
          })
          await newNotif.save()
        }
        const newComment = new Comment({
          userId: userSender._id,
          username:userSender.username,
          imageUrl: userSender.imageUrl,
          postId: post._id,
          content
        })
        post.comments.push(newComment)
        postCount++
        post.commentCount = postCount
        await post.save()
        return await newComment.save()
      }else{
        throw new Error('Post not found')
      }
    } catch (error) {
      throw error
    }
  },
  likePost: async ({postId}, req) => {
    if(!req.isAuth){
      throw new Error('Unauthorized!');
    }
    const likesDoc = await Like.findOne({post: postId, user: req.user.userId})
    const postDoc = await Post.findOne({_id:postId}).populate('comments')
    const userSender = await User.findById(req.user.userId)
    let postData;

    try {
      if(postDoc){
        const user = await User.findById(postDoc.creator)
        postData = postDoc
        if(!likesDoc){
          if(user.id !== req.user.userId){
            const newNotif = new Notification({
              recipient: user.username,
              sender: userSender.username,
              type:'like',
              postId,
              userId: user._id,
              imageUrl: userSender.imageUrl,
              senderId: userSender._id
            })
            await newNotif.save()
          }
          const newLike = new Like({
            username: userSender.username,
            user: userSender._id,
            post: postId
          })
          await newLike.save()
          postDoc.likes.push(newLike)
          postData.likeCount++
          postDoc.likeCount = postData.likeCount
          await postDoc.save()
          return {
            ...postDoc._doc,
            creator: user,
            createdAt: toDateString(postDoc.createdAt),
            updatedAt: toDateString(postDoc.updatedAt)
          }
        }else{
          throw new Error('Already liked post')
        }
      }else{
        throw new Error("Cannot like a post that doesn't exists")
      }
    } catch (error) {
      throw error
    }
  },
  unlikePost: async ({postId}, req) => {
    if(!req.isAuth){
      throw new Error('Unauthorized!');
    }
    const likesDoc = await Like.findOne({post: postId, user: req.user.userId})
    const postDoc = await Post.findOne({_id:postId}).populate('comments')
    let postData;
    try {
      if(postDoc){
        postData = postDoc
        if(likesDoc){
          const user = await User.findById(postDoc.creator)
          if(user.id !== req.user.userId){
            await Notification.findOneAndDelete({postId, type:"like"})
          }
          await likesDoc.deleteOne()
          postData.likeCount--
          postDoc.likeCount = postData.likeCount
          await postDoc.save()
          return {
            ...postDoc._doc,
            creator: user,
            createdAt: toDateString(postDoc.createdAt),
            updatedAt: toDateString(postDoc.updatedAt)
          }
        }else{
          throw new Error('Post not liked')
        }
      }else{
        throw new Error("Cannot unlike a post that doesn't exists")
      }
    } catch (error) {
      throw error
    }
  }
}
