const mongoose = require("mongoose");

const verdictSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    photo:{
        type:String
    },
    support:{
        type:Number,
        default:0
    },
    oppose:{
        type:Number,
        default:0
    },
    comment:{
        type: Array,
        default: []
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    finished:{
        type:Boolean,
        default:false
    },
    CreatedAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = verdict = mongoose.model('Verdict',verdictSchema);