const bucket = require('../config/cloud');
const User = require('../models/user');
const Verdict = require("../models/verdict");

module.exports = async(req,res,next)=>{
    try{
        if(req.route.path==='/:id'){
            const verdict = await Verdict.findById(req.params.id);
            const link = verdict.verdictPreview.split("/");
            var fileName = decodeURIComponent(link[7]);
            if(fileName.includes('Aplication/post-pic.jpg')){
                next();
            }
            bucket.file(fileName).delete();
        }else if(req.route.path==='/:username'){
            const user = await User.find(req.params);
            var fileName = user[0].id;
            await bucket.deleteFiles({ prefix: fileName+'/' })
        }
        next();
    }catch(err){
        next(err);
    }
}