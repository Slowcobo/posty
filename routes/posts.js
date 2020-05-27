const express = require("express");
const router = express.Router({ mergeParams: true });

const Community = require("../models/community");
const Post = require("../models/post");

router.get("/new", (req, res) => {
  Community.findById(req.params.community_id, (err, foundCommunity) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("posts/new", { community: foundCommunity });
    }
  });
});

router.post("/", (req, res) => {
  Community.findById(req.params.community_id, (err, foundCommunity) => {
    if (err) {
      console.log(err);
      res.redirect("/communities");
    } else {
      Post.create(req.body.post, (err, newPost) => {
        if (err) {
          console.log(err);
        } else {
          foundCommunity.posts.push(newPost);
          foundCommunity.save();
        }
        res.redirect("/communities/" + foundCommunity._id);
      });
    }
  });
});

router.get("/:post_id", (req, res) => {
  Post.findById(req.params.post_id)
    .populate({ path: "replies", populate: { path: "replies" } })
    .exec((err, foundPost) => {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        res.render("posts/show", {
          communityId: req.params.community_id,
          post: foundPost,
        });
      }
    });
});

router.post("/:post_id", (req, res) => {
  Post.findById(req.params.post_id, (err, foundPost) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      console.log(foundPost);
      Post.create(req.body.reply, (err, newReply) => {
        if (err) {
          console.log(err);
        } else {
          foundPost.replies.push(newReply);
          foundPost.save();
        }
        res.redirect("back");
      });
    }
  });
});

module.exports = router;
