const mongoose = require('mongoose');
const Schema = mongoose.Schema

const postScema = new Schema({
  content: {
    type: String,
  },
  postImageUrl: {
    type: String
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likeCount:{
    type: Number,
    default: 0,
  },
  commentCount:{
    type: Number,
    default: 0,
  },
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Like'}]
},
{
  timestamps: true
}
);

module.exports = mongoose.model('Post', postScema);