const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    profilePictire:{
        type: String,
        default:"https://firebasestorage.googleapis.com/v0/b/netizens-verdict.appspot.com/o/Application%2Fprofile-pic.png"
    },
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    about: {
        type: String,
        max: 50
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    follower: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    posted: {
        type: Array,
        default: []
    },
    supported: {
        type: Array,
        default: []
    },
    opposed: {
        type: Array,
        default: []
    },
    saved: {
        type: Array,
        default: []
    },
});

module.exports = mongoose.model('User',userSchema);