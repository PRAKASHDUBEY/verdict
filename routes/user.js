const express = require("express");
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/user_jwt');
var fs = require('fs');
var multer = require('multer');

//Upload Image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './uploads');
    },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
  }
});
const uploadImg = multer({storage: storage}).single('img');

router.put("/uploadImage", uploadImg, auth, async(req,res)=>{
  try{
    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString('base64');
    var final_img=Buffer.from(encode_img,'base64');
    res.status(200).contentType(req.file.mimetype).send(final_img);
  }catch(err){
    console.log(err)
  }  
})


//Get Account
router.get('/', auth, async (req,res,next) => {
  try{
    const user =await User.findById(req.user.id).select('-password');
      res.status(200).json({
        success:true,
        user:user
      })
  }catch{
    console.log(error.message);
    res.status(500).json({
      success:false,
      msg:'Server Error'
    })
    next();
  }
});

//Update Account
router.put("/", auth, async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(req.user.id, {
      $set: req.body,
    });
    res.status(200).json({ 
      success:true,
      msg:"Account has been successfulley updated"
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

//Delete Account
router.delete("/", auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({
      success:true,
      msg:"Your account has been successfully deleted"
    });
  }catch (err) {
    return res.status(500).json(err);
  }
});

//Get Profile
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.find(req.params);
    //const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Follow or Unfollow Profile
router.put("/profile/:username" , auth, async (req, res) => {
  try {
    const followUserParam = await User.find({'username':req.params.username});
    const followUserID= followUserParam[0].id;
    const followUserObject = await User.findById(followUserID);
    const currentUser = await User.findById(req.user.id);

    if (!currentUser.followings.includes(followUserID)) {
      await followUserObject.updateOne({ $push: { followers: req.user.id } });
      await currentUser.updateOne({ $push: { followings: followUserID } });
      res.status(200).json({
        success:true,
        msg:"user has been followed"
      });
    } else {
      await followUserObject.updateOne({ $pull: { followers: req.user.id } });
      await currentUser.updateOne({ $pull: { followings: followUserID } });
      res.status(200).json({
        success:true,
        msg:"user has been unfollowed"
      });
    }
  }catch (err) {
    console.log(err)
    return res.status(500).json(err);
  }
});

module.exports = router;