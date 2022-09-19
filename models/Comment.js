const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({  // Create Comment Schema
  comment: {  // log commeent
    type: String,
    required: true,
  },
  likes: {  // number of likes on comment
    type: Number,
    required: true,
  },
  user: {  // user ID that made the comment
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userName: {  // userName that made the comment
    type: mongoose.Schema.Types.String,
    ref: "User",
  },
  post: {  // log post that comment was made on
    type: String,
    ref: "Post",
  },
  createdAt: {  // date comment was created
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
