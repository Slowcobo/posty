const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  avatar: { type: String, default: "https://i.imgur.com/aqg1zBj.jpg" }, //TODO: Refactor to using image file instead of url
  bio: String,
  communities: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Community",
    },
  ],
  posts: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Post",
    },
  ],
  comments: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Comment",
    },
  ],
  karma: {
    type: Number,
    default: 0,
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
