const express = require("express");
const router = express.Router({mergeParams: true});
const Community = require("../models/community");

router.get("/", (req, res) => {
  Community.find({}, (err, communities) => {
    if (err) {
      console.log(err);
    } else {
      res.render("communities/index", { communities: communities });
    }
  });
});

router.get("/new", (req, res) => {
  res.render("communities/new");
});

router.post("/", (req, res) => {
  Community.create(req.body.community, (err, newCommunity) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("communities");
    }
  });
});

router.get("/:community_id", (req, res) => {
  Community.findById(req.params.community_id)
    .populate("posts")
    .exec((err, foundCommunity) => {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        res.render("communities/show", { community: foundCommunity });
      }
    });
});

module.exports = router;
