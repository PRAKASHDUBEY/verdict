const express = require("express");
const router = express.Router();
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const Verdict = require('../models/verdict');
const auth = require('../middleware/user_jwt');
const Cloud = require('../middleware/cloud_upload');
const deCloud = require('../middleware/cloud_delete');
const fileUpload = require('../middleware/file_handler');

//Profile and posted verdict
router.get('/:username', async (req,res) => {
    try{
      console.log(req.params);
        const user =await User.find(req.params).select('-password').select('-email');
        const verdict = await Verdict.find({_id: user[0].posted});
        if(!user || !verdict){
          return res.status(400).json({
              msg:"Error in loading profile"
          });
        }
        res.status(200).json({
          user:user,
          verdict:verdict
        });
    }catch(err){
      res.status(500).json({
        msg:`Server Error: ${err}`
      });
    }
});

//Profile and supported verdict
router.get('/:username/supported', async (req,res) => {
    try{ 
        const user =await User.find(req.params).select('-password').select('-email');
        const verdict = await Verdict.find({_id: user[0].supported});
        if(!user || !verdict){
          return res.status(400).json({
              msg:"Error in loading profile"
          });
        }
        res.status(200).json({
          user:user,
          verdict:verdict
        });
    }catch(err){
      res.status(500).json({
        msg:`Server Error: ${err}`
      });
    }
});

//Profile and opposed verdict
router.get('/:username/opposed', async (req,res) => {
    try{
        const user =await User.find(req.params).select('-password').select('-email');
        const verdict = await Verdict.find({_id: user[0].opposed});
        if(!user || !verdict){
          return res.status(400).json({
              msg:"Error in loading profile"
          });
        }
        res.status(200).json({
          user:user,
          verdict:verdict
        });
    }catch(err){
      res.status(500).json({
        msg:`Server Error: ${err}`
      });
    }
});

//Profile and saved verdict
router.get('/:username/saved', async (req,res) => {
    try{
        const user =await User.find(req.params).select('-password').select('-email');
        const verdict = await Verdict.find({_id: user[0].saved});
        if(!user || !verdict){
          return res.status(400).json({
              msg:"Error in loading profile"
          });
        }
        res.status(200).json({
          user:user,
          verdict:verdict
        });
    }catch(err){
      res.status(500).json({
        msg:`Server Error: ${err}`
      });
    }
});

//Profile  Follower
router.get('/:username/follower', async (req,res) => {
    try{
        const user =await User.find(req.params).select('-password').select('-email');
        const follower =await User.find({_id:user.follower}).select('-password').select('-email');

        if(!follower){
          return res.status(400).json({
              msg:"Error in loading follower"
          });
        }
        res.status(200).json({
          follower:follower
        });
    }catch(err){
      res.status(500).json({
        msg:`Server Error: ${err}`
      });
    }
});

//Profile  Following
router.get('/:username/following', async (req,res) => {
    try{
        const user =await User.find(req.params).select('-password').select('-email');
        const following =await User.find({_id:user.following}).select('-password').select('-email');

        if(!follower){
          return res.status(400).json({
              msg:"Error in loading following"
          });
        }
        res.status(200).json({
          following:following
        });
    }catch(err){
      res.status(500).json({
        msg:`Server Error: ${err}`
      });
    }
});

//Update Account
router.put('/:username', auth, fileUpload.single('profile'), Cloud, async (req, res) => {
    try {
      var email_msg;
      let user_email_exist = await User.findOne({email:req.body.email});
      if(user_email_exist){
        email_msg='User already existing';
      }else{
        await User.findByIdAndUpdate(req.user.id, {
          $set:{email:req.body.email}
        });
      }
      var username_msg;
      let username_exist = await User.findOne({username:req.body.username});
      if(username_exist){
        username_msg='Username not available';
      }else{
        await User.findByIdAndUpdate(req.user.id, {
          $set:{username:req.body.username}
        });
      }
      var password_msg;
      const user = await User.findById(req.user.id);
      const isMatch = await bcryptjs.compare(req.body.currentpassword, user.password); 
      if(isMatch){
        const salt = await bcryptjs.genSalt(10);
        const password = await bcryptjs.hash(req.body.newpassword, salt);
        await User.findByIdAndUpdate(req.user.id, {
          $set:{password:password}
        });
      }else{
        password_msg="Current password is wrong";   
      }
      const profile = await User.findByIdAndUpdate(req.user.id, {
        $set:{ 
          name:req.body.name,
          about:req.body.about,
          profilePictire:req.imgUrl,
        }
      });
      if(!profile){ 
        return res.status(400).json({
            msg:"Something went wrong"
        });
      }
      res.status(202).json({ 
        msg:`Account updated`,
        username:username_msg,
        email:email_msg,
        password:password_msg
      });
    } catch (err) {
      return res.status(500).json({
        msg:`Server Error: ${err}`
      });
    }
});

//Delete Account
router.delete("/:username", auth, deCloud, async (req, res) => {
    try {
        await Verdict.deleteMany({user:req.user.id});
        await User.findByIdAndDelete(req.user.id);
        res.status(200).json({
          msg:"Account Deleted"
        });
    }catch (err) {
        return res.status(500).json({
          msg:`Server Error: ${err}`
        });
    }
});

module.exports = router;