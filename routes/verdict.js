const express = require("express");
const router = express.Router();
const Verdict = require("../models/verdict");
const auth = require("../middleware/user_jwt");


//Create verdict
router.post('/',auth, async(req, res, next) => {
    try{
        const verdict = await Verdict.create({ title:req.body.title, description:req.body.description, user:req.user.id});
        if(!verdict){
            return res.status(400).json({
                success:false,
                msg:"Something went wrong"
            });
        }
        res.status(200).json({
            success:true,
            verdict:verdict,
            msg:"Successfully created Verdict"
        });
    }catch(error){
        next(error);
    }
});

//Get posted verdicts
router.get('/',auth,async(req,res,next) => {
    try{
        const verdict = await Verdict.find({user: req.user.id, finished:false});
        if(!verdict){
            return res.status(400).json({
                success:false,
                msg:"Some Error in loading your verdicts"
            });
        }

        res.status(200).json({
            success:true,
            count:verdict.length,
            verdict:verdict,
            msg:" Successfull loading of your verdicts"
        });
    }catch(error){
        next(error);
    }
});

//Get supported verdicts
router.get('/supported',auth,async(req,res,next) => {
    try{
        const verdict = await Verdict.find({user: req.user.id, finished:true});
        if(!verdict){
            return res.status(400).json({
                success:false,
                msg:"Some Error in loading your verdicts"
            });
        }

        res.status(200).json({
            success:true,
            count:verdict.length,
            verdict:verdict,
            msg:" Successfull loading of your verdicts"
        });
    }catch(error){
        next(error);
    }
});

//Get opposed verdicts
router.get('/opposed',auth,async(req,res,next) => {
    try{
        const verdict = await Verdict.find({user: req.user.id, finished:true});
        if(!verdict){
            return res.status(400).json({
                success:false,
                msg:"Some Error in loading your verdicts"
            });
        }

        res.status(200).json({
            success:true,
            count:verdict.length,
            verdict:verdict,
            msg:" Successfull loading of your verdicts"
        });
    }catch(error){
        next(error);
    }
});

//Update verdict
router.put('/:id',async(req,res,next) => {
    try{
        let verdict = await Verdict.findById(req.params.id);
        if(!verdict){
            return res.status(400).json({
                success:false,
                msg: 'Verdict do not exist'
            });
        }
        verdict = await Verdict.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
            runValidators:true
        });
        
        return res.status(200).json({
            success:true,
            verdict:verdict,
            msg: 'Successfully updated'
        });

    }catch(error){
        next(error);
    }
});


//Delete posted verdict
router.delete('/:id' , async(req,res,next) => {
    try{
        let verdict = await Verdict.findById(req.params.id);
        if(!verdict){
            res.status(400).json({
                success:false,
                msg:"Verdict do not exist"
            });
        }
        verdict = await Verdict.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success:true,
            msg:"Successfully Deleted"
        });
    }catch(error){
        next(error);
    }

});


module.exports = router;