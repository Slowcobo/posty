const express = require("express");
const router = express.Router({ mergeParams: true });
const Community = require("../models/community");
const User = require("../models/user");
const middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, (req, res) => {
  Community.find({}, (err, communities) => {
    if (err) {
      console.log(err);
    } else {
      res.render("communities/index", { communities: communities });
    }
  });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("communities/new");
});

router.post("/", middleware.isLoggedIn, (req, res) => {
  const owner = {
    id: req.user._id,
    username: req.user.username,
  };
  Community.create(req.body.community, (err, newCommunity) => {
    if (err) {
      console.log(err);
    } else {
      newCommunity.owner = owner;
      newCommunity.members.push(req.user);
      newCommunity.save();

      req.user.communities.push(newCommunity);
      req.user.save();

      res.redirect(`communities/${newCommunity._id}`);
    }
  });
});

router.get("/:community_id", middleware.isLoggedIn, (req, res) => {
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

router.get(
  "/:community_id/edit",
  middleware.checkCommunityOwnership,
  (req, res) => {
    Community.findById(req.params.community_id, (err, foundCommunity) => {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        res.render("communities/edit", { community: foundCommunity });
      }
    });
  }
);

router.put("/:community_id", middleware.checkCommunityOwnership, (req, res) => {
  Community.findByIdAndUpdate(
    req.params.community_id,
    req.body.community,
    (err) => {
      if (err) {
        res.redirect("back");
      } else {
        res.redirect(`/communities/${req.params.community_id}`);
      }
    }
  );
});

//TODO - Ensure community has no posts before deleting
router.delete(
  "/:community_id",
  middleware.checkCommunityOwnership,
  middleware.checkIfCommunityValid,
  (req, res) => {
    Community.findByIdAndDelete(
      req.params.community_id,
      (err, deletedCommunity) => {
        if (err) {
          res.redirect("back");
        } else {
          //Remove from members
          deletedCommunity.members.forEach((member) => {
            User.findById(member._id, (err, foundMember) => {
              if (err) {
                console.log(err);
              } else {
                const communityIndex = foundMember.communities.findIndex(
                  (community) => {
                    community._id.equals(deletedCommunity._id);
                  }
                );

                foundMember.communities.splice(communityIndex, 1);
                foundMember.save();
              }
            });
          });
          res.redirect("/dashboard");
        }
      }
    );
  }
);

//TODO: Refactor this
router.post("/:community_id/subscribe", middleware.isLoggedIn, (req, res) => {
  Community.findById(req.params.community_id, (err, foundCommunity) => {
    if (err) {
      res.redirect("back");
    } else {
      if (!foundCommunity.members.includes(req.user._id)) {
        //Add community to user
        req.user.communities.push(foundCommunity);
        req.user.save();

        //Add user to community
        foundCommunity.members.push(req.user);
        foundCommunity.save();

        res.end();
      }
    }
  });
});

//TODO: Refactor this
router.post("/:community_id/unsubscribe", middleware.isLoggedIn, (req, res) => {
  Community.findById(req.params.community_id, (err, foundCommunity) => {
    if (err) {
      res.redirect("back");
    } else {
      //Remove community from user
      const communityIndex = req.user.communities.findIndex((community) =>
        community._id.equals(foundCommunity.id)
      );
      req.user.communities.splice(communityIndex, 1);
      req.user.save();

      //Remove user from community
      const userIndex = foundCommunity.members.findIndex((member) =>
        member._id.equals(req.user._id)
      );
      foundCommunity.members.splice(userIndex, 1);
      foundCommunity.save();

      res.end();
    }
  });
});

router.get("/:community_id/members", (req, res) => {
  Community.findById(req.params.community_id, (err, foundCommunity) => {
    if (err) {
      res.redirect("back");
    } else {
      res.send("This is where the member list will be");
      //res.render('communities/members/show');
    }
  });
});

module.exports = router;
