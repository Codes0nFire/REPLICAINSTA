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
    expires:50*60*60
   
   
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


