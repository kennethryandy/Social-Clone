const Post = require('../../model/posts')
const User = require('../../model/users')

const {toDateString} = require('../../helpers/toDateString')
const merge = require('./merge')

module.exports = {
  posts: async () => {
    try {
      const doc = await Post.find().sort('-createdAt').populate('comments').populate('likes')
      return doc.map(post => ({
          ...post._doc,
          creator: merge.populateUser.bind(this, post.creator),
          createdAt: toDateString(post.createdAt),
          updatedAt: toDateString(post.updatedAt)
        })
      )
    }
    catch (err) {
      throw err
    }
  },
  //Create Post
  createPost: async ({content}, req) => {
    if(!req.isAuth){
      throw new Error('Unauthorized!');
    }
    const newPost = new Post({
      content,
      creator: req.user.userId
    })
    try {
      const user = await User.findById(req.user.userId)
      if(user){
        user.posts.push(newPost)
        await user.save()
        await newPost.save()
        return {
          ...newPost._doc,
          creator: merge.populateUser.bind(this, newPost.creator),
          createdAt: toDateString(newPost.createdAt),
          updatedAt: toDateString(newPost.updatedAt)
        }
      }
    }
    catch (err) {
      throw err
    }
  },
}