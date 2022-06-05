const express=require("express");
const { body,validationResult} = require("express-validator");
const res = require("express/lib/response");
const User = require("../models/User");


const router=express.Router();

//Create a User using : POST "/api/auth/createuser". No Login Require

router.post("/createuser",
body('name').isLength({ min: 3 }),
body('email').isEmail(),
body('password').isLength({ min: 5 }),
async(req,res)=>{
  try{
  //If there are errors then send bad request with message
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    //Check wheather user exist with same mail id

    console.log(req.body.email);
    let userExist= await User.findOne({email:req.body.email});
    if(userExist){
      return res.status(400).json({ errors: `User with ${req.body.email} mailid already exist`});
    }
    else{
      //Creating user  in database
     let user=await User.create({
        name: req.body.name,
        email:req.body.email,
        password: req.body.password,
      })
      res.json(user);
    }
  }
  catch(error){
    console.log(error.message);
    res.status(500).send("some error occured, please try after some time")
  }
  
    
    
  // console.log(req.body);
  // const user=User(req.body)
  // user.save()
  // res.send("hello")
}
)



module.exports=router;