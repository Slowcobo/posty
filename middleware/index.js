const Community = require("../models/community");
const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
const middleware = {};

middleware.checkCommunityOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Community.findById(req.params.community_id, (err, foundCommunity) => {
      if (err) {
        res.redirect("back");
      } else {
        if (foundCommunity.owner.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middleware.checkIfCommunityValid = (req, res, next) => {
  if (req.isAuthenticated()) {
    Community.findById(req.params.community_id, (err, foundCommunity) => {
      if (foundCommunity.posts.length !== 0) {
        res.redirect("back");
      } else {
        next();
      }
    });
  }
};

middleware.checkPostOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Post.findById(req.params.post_id, (err, foundPost) => {
      if (err) {
        res.redirect("back");
      } else {
        if (foundPost.author.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

//TODO: Check Comment Ownership
middleware.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect("back");
      } else {
        if (foundComment.author.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middleware.checkUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    User.findById(req.params.user_id, (err, foundUser) => {
      if (err) {
        res.redirect("back");
      } else {
        if (foundUser.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middleware.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

module.exports = middleware;
