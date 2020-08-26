const {toDateString} = require('../../helpers/toDateString')
const Post = require('../../model/posts')
const User = require('../../model/users')
const Comment = require('../../model/comments')


const populateUser = async userId => {
  try {
    const user = await User.findById(userId)
    return {...user._doc, posts: populatePost.bind(this, user.posts)}
  } catch (error) {
    throw error
  }
}
const populatePost = async postId => {
  try {
    const posts = await Post.find({_id: postId})
    return posts.map(post => ({
      ...post._doc,
      createdAt: toDateString(post.createdAt),
      updatedAt: toDateString(post.updatedAt),
      creator: populateUser.bind(this, post.creator),
      comments: populateComments.bind(this, post.comments)
    }))
  } catch (error) {
    throw error
  }
}

const populateComments = async commentId => {
  try {
    const comments = await Comment.find({_id: commentId})
    return comments.map(comment => ({
      ...comment._doc,
      user: populateUser.bind(this, comment.user),
    }))
  } catch (error) {
    throw error
  }
}


module.exports = {
  populateUser,
  populatePost,
  populateComments
}