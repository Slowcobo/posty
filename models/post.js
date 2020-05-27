const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: String,
  title: String,
  body: String,
  image: {
    type: String,
    default:
      "https://i1.wp.com/www.hisour.com/wp-content/uploads/2018/04/Blush-color.jpg?fit=720%2C720&ssl=1",
  },
  replies: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Post",
    },
  ],
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
});

module.exports = mongoose.model("Post", postSchema);
