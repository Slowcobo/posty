const express = require("express"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user");

const communityRoutes = require("./routes/communities"),
  postRoutes = require("./routes/posts"),
  commentRoutes = require("./routes/comments"),
  indexRoutes = require("./routes/index");

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

app.use(
  require("express-session")({
    secret: "This is a test secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(indexRoutes);
app.use("/communities", communityRoutes);
app.use("/communities/:community_id/posts", postRoutes);
app.use("/communities/:community_id/posts/:post_id/:comment_id", commentRoutes);

app.listen(3000, () => {
  console.log("Server started.");
});
