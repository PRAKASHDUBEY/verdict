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
    img:{
        data: Buffer,
        contentType: String
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
    CreatedAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = verdict = mongoose.model('Verdict',verdictSchema);