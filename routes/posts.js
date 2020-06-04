const express = require("express");
const router = express.Router({ mergeParams: true });

const User = require("../models/user");
const Community = require("../models/community");
const Post = require("../models/post");
const Comment = require("../models/comment");
const middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, (req, res) => {
  Community.findById(req.params.community_id, (err, foundCommunity) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("posts/new", { community: foundCommunity });
    }
  });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
  Community.findById(req.params.community_id, (err, foundCommunity) => {
    if (err) {
      console.log(err);
      res.redirect("/communities");
    } else {
      Post.create(req.body.post, (err, newPost) => {
        if (err) {
          console.log(err);
        } else {
          newPost.author = req.user;
          newPost.save();

          console.log(newPost);
          //Add post to community
          foundCommunity.posts.push(newPost);
          foundCommunity.save();
          //Add post to user
          req.user.posts.push(newPost);
          req.user.save();
        }
        res.redirect(`/communities/${foundCommunity._id}/posts/${newPost._id}`);
      });
    }
  });
});

router.get("/:post_id", middleware.isLoggedIn, (req, res) => {
  Post.findById(req.params.post_id)
    .populate({
      path: "replies",
      populate: {
        path: "author",
      },
    })
    .populate("author")
    .exec((err, foundPost) => {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        Community.findById(req.params.community_id, (err, foundCommunity) => {
          if (err) {
            res.redirect("back");
          } else {
            res.render("posts/show", {
              community: foundCommunity,
              post: foundPost,
            });
          }
        });
      }
    });
});

router.get("/:post_id/edit", middleware.checkPostOwnership, (req, res) => {
  Post.findById(req.params.post_id, (err, foundPost) => {
    if (err) {
      console.log(err);
    } else {
      Community.findById(req.params.community_id, (err, foundCommunity) => {
        if (err) {
          res.redirect("back");
        } else {
          res.render("posts/edit", {
            community: foundCommunity,
            post: foundPost,
          });
        }
      });
    }
  });
});

router.put("/:post_id", middleware.checkPostOwnership, (req, res) => {
  Post.findByIdAndUpdate(
    req.params.post_id,
    req.body.post,
    (err, foundPost) => {
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

router.delete("/:post_id", middleware.checkPostOwnership, (req, res) => {
  Post.findByIdAndDelete(req.params.post_id, (err, deletedPost) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      //Remove post from user
      const postIndex = req.user.posts.findIndex((post) =>
        post._id.equals(deletedPost._id)
      );
      req.user.posts.splice(postIndex, 1);
      req.user.save();

      res.redirect(`/communities/${req.params.community_id}`);
    }
  });
});

router.post("/:post_id", middleware.isLoggedIn, (req, res) => {
  Post.findById(req.params.post_id, (err, foundPost) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      Comment.create(req.body.comment, (err, newComment) => {
        if (err) {
          console.log(err);
        } else {
          newComment.author = req.user;
          newComment.save();
          //Add comment to post
          foundPost.replies.push(newComment);
          foundPost.save();
          //Add comment to user
          req.user.comments.push(newComment);
          req.user.save();
        }
        res.redirect("back");
      });
    }
  });
});

//TODO: Handle likes and dislikes
// router.post("/:post_id/like", middleware.isLoggedIn, (req, res) => {
//   Post.findById(req.params.post_id, (err, foundPost) => {
//     if (err) {
//       console.log(err);
//       res.redirect("back");
//     } else {
//       foundPost.likes += 1;
//       foundPost.save();
//     }
//   });
// });

module.exports = router;
