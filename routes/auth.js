const express = require("express");
const router = express.Router();
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
    const {name, username, email, password} = req.body;
    try{
        let user_email_exist = await User.findOne({email:email});
        let username_exist = await User.findOne({username:username});
        if(user_email_exist){
            res.status(409).json({
                msg:'User already exist'
            });
        }else if(username_exist){
            res.status(409).json({
                msg:'Username not available'
            });
        }else{
            let user = new User();

            user.name = name;
            user.username = username;
            user.email = email;

            const salt = await bcryptjs.genSalt(10);
            user.password = await bcryptjs.hash(password, salt);

            await user.save();
            const payload ={
                user:{
                    id:user.id
                }
            }
            jwt.sign(payload, process.env.jwtUserSecret,{
                expiresIn:30000
            }, (err, token)=>{
                if (err) throw err;
                res.status(201).json({
                    msg:'Registered successfully',
                    token:token
                });
            })
        }
    }catch(err){
        console.log(err, message);
        res.status(500).json({
            msg:`Server Error: ${err}`
        })
    }
});

//LOGIN
router.post("/login", async (req, res) => {
    const email= req.body.email;
    const password = req.body.password;
    try{
        let user = await User.findOne({
            email:email
        });
        if(!user){
            res.status(404).json({
                msg:'User does not exist, Resister to continue!'
            });
        }   
        const isMatch = await bcryptjs.compare(password, user.password);    
        if(!isMatch){
            return res.status(401).json({
                msg:'Inavalid Credentials'  
            })
        }   
        const payload = {
            user:{
                id:user.id
            }
        }   
        jwt.sign(payload, process.env.jwtUserSecret,{
            expiresIn:300000
        },(err, token)=>{
            if (err) throw err;
            res.status(200).json({
                token:token
            });
        })  
    }catch(err){
        res.status(500).json({
            msg:`Server Error: ${err}`
        })
    }
});

module.exports = router;