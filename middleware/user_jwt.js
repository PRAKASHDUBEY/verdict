const jwt = require("jsonwebtoken");

module.exports = async function(req, res, next){
    const token = req.header('Authorization');
    if(!token){
        return res.status(401).json({
            msg:"Auth denied, Login to gain access"
        });
    }
    try{
        await jwt.verify(token, process.env.jwtUserSecret, (err, decoded) =>{
            if(err){
                res.status(401).json({
                    msg:"Token not valid"
                });
            }else{
                req.user = decoded.user;
                next();
            }
        });
    }catch(err){
        res.status(500).json({
            msg:`Server Error: ${err}`
        });
    }
}