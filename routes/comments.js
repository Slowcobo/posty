const express = require("express");
const router = express.Router({ mergeParams: true });
const Post = require("../models/post");
const Comment = require("../models/comment");

router.get("/edit", (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("comments/edit", {
        communityId: req.params.community_id,
        postId: req.params.post_id,
        comment: foundComment,
      });
    }
  });
});

router.put("/", (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, foundComment) => {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        res.redirect(
          `/communities/${req.params.community_id}/posts/${req.params.post_id}`
        );
      }
    }
  );
});

router.delete("/", (req, res) => {
  Comment.findByIdAndDelete(req.params.comment_id, (err, foundComment) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.redirect(
        `/communities/${req.params.community_id}/posts/${req.params.post_id}`
      );
    }
  });
});

module.exports = router;
