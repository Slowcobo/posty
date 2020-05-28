const express = require("express"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  Community = require("./models/community"),
  Post = require("./models/post"),
  Comment = require("./models/comment");

const communityRoutes = require("./routes/communities"),
  postRoutes = require("./routes/posts"),
  commentRoutes = require("./routes/comments");

const app = express();

mongoose.connect("mongodb://localhost/postr", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.use("/communities", communityRoutes);
app.use("/communities/:community_id/posts", postRoutes);
app.use("/communities/:community_id/posts/:post_id/:comment_id", commentRoutes);

app.get("/", (req, res) => {
  res.send("This is the index page.");
});

app.listen(3000, () => {
  console.log("Server started.");
});
