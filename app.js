const express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Community = require("./models/community"),
  Post = require("./models/post");

const communityRoutes = require("./routes/communities"),
  postRoutes = require("./routes/posts");

const app = express();

mongoose.connect("mongodb://localhost/postr", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.use("/communities", communityRoutes);
app.use("/communities/:community_id/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("This is the index page.");
});

app.listen(3000, () => {
  console.log("Server started.");
});
