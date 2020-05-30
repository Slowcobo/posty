const express = require("express");
const router = express.Router({ mergeParams: true });
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
  const owner = {
    id: req.user._id,
    username: req.user.username,
  };

  Community.create(req.body.community, (err, newCommunity) => {
    if (err) {
      console.log(err);
    } else {
      newCommunity.owner = owner;
      newCommunity.save();
      res.redirect("communities");
    }
  });
});

router.get("/:community_id", (req, res) => {
  Community.findById(req.params.community_id)
    .populate({
      path: "posts",
      populate: {
        path: "author",
      },
    })
    .exec((err, foundCommunity) => {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        res.render("communities/show", { community: foundCommunity });
      }
    });
});

router.get("/:community_id/edit", (req, res) => {
  Community.findById(req.params.community_id, (err, foundCommunity) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("communities/edit", { community: foundCommunity });
    }
  });
});

router.put("/:community_id", (req, res) => {
  Community.findByIdAndUpdate(
    req.params.community_id,
    req.body.community,
    (err) => {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        res.redirect(`/communities/${req.params.community_id}`);
      }
    }
  );
});

router.delete("/:community_id", (req, res) => {
  Community.findByIdAndDelete(req.params.community_id, (err) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.redirect("/communities");
    }
  });
});

module.exports = router;
