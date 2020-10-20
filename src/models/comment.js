const mongoose = require("mongoose");
const validator = require("validator");

const commentSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", //Makes a reference to a user instance with the ID
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Blog", //Makes a reference to a blog instance with the ID
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
