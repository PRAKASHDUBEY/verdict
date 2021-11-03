const mongoose = require("mongoose");

const verdictSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    finished:{
        type:Boolean,
        default:false
    },CreatedAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = verdict = mongoose.model('Verdict',verdictSchema);