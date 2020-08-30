"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var userSchema = new Schema({
  username: {
    type: String,
    required: true,
    min: 6,
    max: 12
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 18
  },
  imageUrl: {
    type: String
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  bio: String,
  location: String,
  status: String
}, {
  timestamps: true
});
module.exports = mongoose.model('User', userSchema);