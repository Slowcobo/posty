const express = require("express");
const router = express.Router({ mergeParams: true });
const Post = require("../models/post");
const Comment = require("../models/comment");
const middleware = require("../middleware");

router.get("/edit", middleware.checkCommentOwnership, (req, res) => {
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

router.put("/", middleware.checkCommentOwnership, (req, res) => {
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

router.delete("/", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndDelete(req.params.comment_id, (err, deletedComment) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      //Remove comment from post
      Post.findById(req.params.post_id, (err, foundPost) => {
        const commentIndex = foundPost.replies.findIndex((comment) =>
          comment._id.equals(deletedComment._id)
        );
        foundPost.replies.splice(commentIndex, 1);
        foundPost.save();
      });

      //Remove comment from user
      const commentIndex = req.user.comments.findIndex((comment) =>
        comment._id.equals(deletedComment._id)
      );
      req.user.comments.splice(commentIndex, 1);
      req.user.save();

      res.redirect(
        `/communities/${req.params.community_id}/posts/${req.params.post_id}`
      );
    }
  });
});

module.exports = router;
