const express = require("express");
const router = express.Router();
const User = require('../models/user');
const Verdict = require("../models/verdict");
const auth = require("../middleware/user_jwt");
const Cloud = require('../middleware/cloud_upload');
const deCloud = require('../middleware/cloud_delete');
const fileUpload = require('../middleware/file_handler');


//Create Verdict
router.post('/', auth, fileUpload.single('post'), Cloud, async(req, res) => {
    try{
        const verdict = await Verdict.create({
            verdictPreview : req.imgUrl,
            title : req.body.title,
            description : req.body.description,
            category : req.body.category,
            user : req.user.id
        });
        const UserObject = await User.findById(req.user.id);
        await UserObject.updateOne({
            $push:{posted:verdict.id}
        });
        if(!verdict){
            return res.status(400).json({
                msg:"Something went wrong"
            });
        }
        res.status(200).json({verdict:verdict});
    }catch(error){
        res.status(500).send(`Error, could not create post: ${error}`);
    }
});

//Update verdict
router.put('/edit/:id', auth, fileUpload.single('post'), Cloud, async(req,res) => {
    try{
        let verdict = await Verdict.findById(req.params.id);
        if(!verdict){
            return res.status(422).json({
                msg: 'Verdict do not exist'
            });
        }
        verdict = await Verdict.findByIdAndUpdate(req.params.id, {
            $set: {
                verdictPreview : req.imgUrl,
                title : req.body.title,
                description : req.body.description,
                category : req.body.category,
            }},{
            new:true,
            runValidators:true
        });
        return res.status(200).json({
            msg:"Verdict Updated"
        });
    }catch(error){
        res.status(500).send(`Error, could not Edit post: ${error}`);
    }
});

//Delete verdict
router.delete('/:id', auth, deCloud, async(req,res) => {
    try{
        let verdict = await Verdict.findById(req.params.id);
        if(!verdict){
            res.status(400).json({
                msg:"Verdict do not exist"
            });
        }
        verdict = await Verdict.findByIdAndDelete(req.params.id);
        const UserObject = await User.findById(req.user.id);
        await UserObject.updateOne({
            $pull:{posted:req.params.id}
        });
        res.status(200).json({
            msg:"Successfully Deleted"
        });
    }catch(error){
        res.status(500).send(`Error, could not delete post: ${error}`);
    }

});

//Category Verdicts
router.get('/category',async(req,res) => {
    try{
        const verdict = await Verdict.find({category:req.query.q});
        if(!verdict){
            return res.status(400).json({
                msg:`Some Error in loading your ${req.query.q} verdicts`
            });
        }
        res.status(200).json({verdict:verdict});
    }catch(error){
        res.status(500).send(`Error, could not show post: ${error}`);
    }
});

//Following verdict
router.get('/following',auth, async(req,res) => {
    try{
        const UserObject = await User.findById(req.user.id);
        const verdict = await Verdict.find({user: UserObject.following});
        if(!verdict){
            return res.status(400).json({
                msg:"Some Error in loading your verdicts"
            });
        }
        res.status(200).json({verdict:verdict});
    }catch(error){
        res.status(500).send(`Error, could not show post: ${error}`);
    }
});

//Support
router.put('/support',auth, async(req,res) => {
    try{
        const UserObject = await User.findById(req.user.id);
        const VerdictObject = await Verdict.findById(req.query.id);
        if (UserObject.opposed.includes(req.query.id)) {
            await UserObject.updateOne({ $pull: { opposed: req.query.id } });
            await VerdictObject.updateOne({ $pull: { opposed: req.user.id } });
        }
        if (!UserObject.supported.includes(req.query.id)) {
            await UserObject.updateOne({ $push: { supported: req.query.id } });
            await VerdictObject.updateOne({ $push: { support: req.user.id } });

            res.status(200).json({
              msg:"Verdict Supported"
            });
        } else {
            await UserObject.updateOne({ $pull: { supported: req.query.id } });
            await VerdictObject.updateOne({ $pull: { support: req.user.id } });
            res.status(200).json({
              msg:"Verdict support revoked"
            });
        }
    }catch(error){
        res.status(500).send(`Error, could not show post: ${error}`);
    }
});

//Oppose
router.put('/oppose',auth, async(req,res) => {
    try{
        const UserObject = await User.findById(req.user.id);
        const VerdictObject = await Verdict.findById(req.query.id);
        if (UserObject.supported.includes(req.query.id)) {
            await UserObject.updateOne({ $pull: { supported: req.query.id } });
            await VerdictObject.updateOne({ $pull: { support: req.user.id } });
        }
        if (!UserObject.opposed.includes(req.query.id)) {
            await UserObject.updateOne({ $push: { opposed: req.query.id } });
            await VerdictObject.updateOne({ $push: { oppose: req.user.id } });

            res.status(200).json({
              msg:"Verdict Opposed"
            });
        } else {
            await UserObject.updateOne({ $pull: { opposed: req.query.id } });
            await VerdictObject.updateOne({ $pull: { oppose: req.user.id } });
            res.status(200).json({
              msg:"Verdict Oppose revoked"
            });
        }
    }catch(error){
        res.status(500).send(`Error, could not show post: ${error}`);
    }
});

//Save
router.put('/save',auth, async(req,res) => {
    try{
        const UserObject = await User.findById(req.user.id);
        if (!UserObject.saved.includes(req.query.id)) {
            await UserObject.updateOne({ $push: { saved: req.query.id } });
            res.status(200).json({
              msg:"Verdict saved"
            });
        } else {
            await UserObject.updateOne({ $pull: { saved: req.query.id } });
            res.status(200).json({
              msg:"Verdict Unsaved"
            });
        }
    }catch(error){
        res.status(500).send(`Error, could not show post: ${error}`);
    }
});

module.exports = router;