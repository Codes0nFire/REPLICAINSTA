var mongoose = require("mongoose");

var commentSchema = mongoose.Schema(
  {
    text: String,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("comment", commentSchema);
