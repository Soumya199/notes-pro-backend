const express=require("express");
const { body } = require("express-validator");
const User = require("../models/User");

const router=express.Router();

//Create a User using : POST "/api/auth/". Dosesn't require Auth

router.post("/",
(req,res)=>{
  console.log(req.body);
  const user=User(req.body)
  user.save()
  res.send("hello")
})


module.exports=router;