const express = require("express");
const router = express.Router();
const User = require('../models/user' );
const Verdict = require('../models/verdict');
const auth = require('../middleware/user_jwt');

//Home page or redirecting to login
router.get('/', auth, async(req,res)=>{
  const user =await User.findById(req.user.id).select('-password').select('-email');
  const username = await User.find({username:user.username});
  res.status(204).json({
    username:username,
    msg:"Home Route under development"
  });
});

//Search
router.get("/search", async (req, res) => {
    try {
      const user = await User.find({$or: [ { username: { $regex: req.query.q, $options: "i" } },{name: { $regex: req.query.q, $options: "i"}}]}).select('-password').select('-email');
      res.status(200).json({user:user});
    } catch (err) {
      res.status(500).json({
        msg:`Server Error :${err}`
      });
    }
});

//Follow and UnFollow
router.put("/follow/:id" , auth, async (req, res) => {
    try {
        const followUserObject = await User.findById(req.params.id);
        const currentUserObject = await User.findById(req.user.id);

        if (!currentUserObject.following.includes(req.params.id)) {
            await followUserObject.updateOne({ $push: { follower: req.user.id } });
            await currentUserObject.updateOne({ $push: { following: req.params.id } });
            res.status(200).json({
              msg:"Profile followed"
            });
        } else {
            await followUserObject.updateOne({ $pull: { follower: req.user.id } });
            await currentUserObject.updateOne({ $pull: { following: req.params.id } });
            res.status(200).json({
              msg:"Profile unfollowed"
            });
        }
    }catch (err) {
        res.status(500).json({
          msg:`Server Error :${err}`
        });
    }
});

module.exports = router;