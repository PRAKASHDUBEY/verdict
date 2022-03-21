const mongoose = require("mongoose");

const verdictSchema = new mongoose.Schema({
    verdictPreview:{
        type:String,
        default:"https://firebasestorage.googleapis.com/v0/b/netizens-verdict.appspot.com/o/Application%2Fpost-pic.jpg"
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    category:{
        type:String,
        required:true
    },
    support:{
        type:Array,
        default:[]
    },
    oppose:{
        type:Array,
        default:[]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    CreatedAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = verdict = mongoose.model('Verdict',verdictSchema);