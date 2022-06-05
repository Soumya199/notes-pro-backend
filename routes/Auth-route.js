const express=require("express");
const { body,validationResult} = require("express-validator");
const User = require("../models/User");


const router=express.Router();

//Create a User using : POST "/api/auth/". Dosesn't require Auth

router.post("/",
body('name').isLength({ min: 3 }),
body('email').isEmail(),
body('password').isLength({ min: 5 }),
(req,res)=>{

  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.create({
      name: req.body.name,
      email:req.body.email,
      password: req.body.password,
    }).then(user => res.json(user))
    .catch((errors)=>{console.log(errors);
      res.json({error: "Please enter an unique value for email"});
    });
    
  // console.log(req.body);
  // const user=User(req.body)
  // user.save()
  // res.send("hello")
})


module.exports=router;