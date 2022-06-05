const jwt = require("jsonwebtoken");


const JWT_SECREAT = "fool";
const fetchUser=(req,res,next)=>{
    //Get the user from the jwt token and add id to req object

    const token=req.header('auth-token')
    if(!token){
        res.status(401).send({error:"Please authenticate using a vald token"})
    }
    try {
        const data=jwt.verify(token,JWT_SECREAT);
        req.user=data.user;
        next();
    } catch (error) {
        res.status(401).send({error:"Please authenticate using a vald token"})
    }
    
}

module.exports=fetchUser;