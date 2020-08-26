const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    min: 6,
    max: 12,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 18,
  },
  imageUrl: {type: String, default: "uploads\\default-profile-pic.png"},
  posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
  bio: String,
  location: String,
  status: String,
},{
  timestamps: true
})

module.exports =  mongoose.model('User', userSchema);
