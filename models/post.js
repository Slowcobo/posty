const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: String,
  title: String,
  body: String,
  replies: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Comment",
    },
  ],
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
});

module.exports = mongoose.model("Post", postSchema);
