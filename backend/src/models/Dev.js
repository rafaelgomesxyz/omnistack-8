const { Schema, model } = require('mongoose');

const DevSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  bio: String,
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'Dev',
  }],
  dislikes: [{
    type: Schema.Types.ObjectId,
    ref: 'Dev',
  }],
  matches: [{
    type: Schema.Types.ObjectId,
    ref: 'Dev',
  }],
}, {
  timestamps: true,
});

module.exports = model('Dev', DevSchema);