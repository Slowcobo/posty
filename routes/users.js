const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", (req, res) => {
  res.send("This is the user route");
});

router.get("/:user_id", (req, res) => {
  User.findById(req.params.user_id, (err, foundUser) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("user/show", { user: foundUser });
    }
  });
});

router.get("/:user_id/edit", (req, res) => {
  User.findById(req.params.user_id, (err, foundUser) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("user/edit", { user: foundUser });
    }
  });
});

router.put("/:user_id", (req, res) => {
  User.findByIdAndUpdate(req.params.user_id, req.body.user, (err) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.redirect(`/user/${req.params.user_id}`);
    }
  });
});

module.exports = router;
