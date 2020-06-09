const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  isPrivate: Boolean,
  owner: {
    id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    username: String,
  },
  members: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  ],
  posts: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Post",
    },
  ],
});

module.exports = mongoose.model("Community", communitySchema);
