const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Stories will expire and be removed after 24 hours (86400 seconds)
  },
  picture: {
    type: Object,
    default:{
      fileId:"",
      url:""
    }
  },
});

module.exports = mongoose.model('story', storySchema);


