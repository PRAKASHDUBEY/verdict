const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String,
        default:""
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
    bio: {
        type: String,
        max: 50
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
});

module.exports = mongoose.model('User',userSchema);