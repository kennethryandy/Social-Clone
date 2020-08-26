const User = require('../../model/users')
const Notification = require('../../model/notifications')
const Likes = require('../../model/likes')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')

const merge = require('./merge')
const {signupValidators, loginValidators} = require('../../util/validators')

module.exports = {
  users: async () => {
    const users = await User.find().populate('posts')
    return users.map(user => {
      return {
        ...user._doc,
        posts: merge.populatePost.bind(this, user.posts)
      }
    })
  },
  signup: async ({userInput}) => {
    const {username, email, password} = userInput
    const {error} = signupValidators.validate(userInput)
    if(error){
      if(error.message === "\"email\" must be a valid email")throw new Error("Invalid email address")
      if(error.message === "\"username\" is not allowed to be empty" || error.message === "\"email\" is not allowed to be empty" || error.message === "\"password\" is not allowed to be empty") throw new Error('Email, username and password must not be empty')
      throw error
    }
    const existingUser = await User.findOne({email})
    if(existingUser){
      throw new Error('Email already taken.')
    }else{
      const hashedPw = await bcrypt.hash(password, 12);
      const newUser = new User({
        username,
        email,
        password: hashedPw,
      })
      try {
        const result = await newUser.save()
        // const token = JWT.sign({userId: user._id, email: user.email, username: user.username, imageUrl: user.imageUrl}, process.env.TOKEN_SECRET,{expiresIn: '1h'});
        const token = signToken(result._id, result.email, result.username, result.imageUrl)
        return{
          userId: result._id,
          token,
          tokenExp: 4
        }
      }
      catch (err) {
        throw err
      }
    }
  },
  editUserDetails: async ({userDetails}, req) => {
    const { bio, location, status } = userDetails
    if(bio.trim() && location.trim() && status.trim() === '') {
      return
    }
    if(!req.isAuth){
      throw new Error("Unauthorized!")
    }
    const user = await User.findById(req.user.userId)
    try {
      if(user){
        if(bio.trim() !== '') user.bio = bio
        if(location.trim() !== '') user.location = location
        if(status.trim() !== '') user.status = status
        return await user.save()
      }else{
        throw new Error("User not found")
      }
    } catch (error) {
      throw error
    }
  },
  login: async ({email, password}) => {

    try {
      const user = await User.findOne({email})
      if(!user) throw new Error('Wrong email or password.')
      const comparedPw = await bcrypt.compare(password, user.password)
      if(!comparedPw) throw new Error('Wrong email or password.');
  
      // const token = JWT.sign({userId: user._id, email: user.email, username: user.username, imageUrl: user.imageUrl}, process.env.TOKEN_SECRET,{expiresIn: '1h'});

      const token = signToken(user._id, user.email, user.username, user.imageUrl)
  
      return{
        userId: user._id,
        username: user.username,
        token,
        tokenExp: 4
      }
    } catch (err) {
      throw err
    }
  },
}

const signToken = (userId, email, username, imageUrl) => {
  return JWT.sign({userId, email, username, imageUrl}, process.env.TOKEN_SECRET,{expiresIn: '4h'});
}