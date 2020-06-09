const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const User = require("../models/user");
const middleware = require("../middleware");

router.get("/", (req, res) => {
  res.send("This is the index page.");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  let newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log("Error: " + err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/dashboard");
    });
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get("/dashboard", middleware.isLoggedIn, (req, res) => {
  User.findById(req.user._id)
    .populate("communities")
    .exec((err, foundUser) => {
      res.render("index", { currentUser: foundUser });
    });
});

module.exports = router;
