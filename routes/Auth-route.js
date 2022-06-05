const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchUser=require("../middleware/fetchuser")

const router = express.Router();
const saltRounds = 8;
const JWT_SECREAT = "fool";

//Route1: Create a User using : POST "/api/auth/createuser". No Login Require

router.post(
  "/createuser",
  body("name").isLength({ min: 3 }),
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  async (req, res) => {
    try {
      //If there are errors then send bad request with message
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      //Check wheather user exist with same mail id
      let userExist = await User.findOne({ email: req.body.email });
      if (userExist) {
        return res
          .status(400)
          .json({ errors: `User with ${req.body.email} mailid already exist` });
      } else {
        //Encrypting Password with bcrypt package module

        const salt = await bcrypt.genSalt(saltRounds);
        const secPassword = await bcrypt.hash(req.body.password, salt);

        //Creating user  in database
        let user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: secPassword,
        });
        //sending authtoken to the user in response
        const data = {
          user: {
            id: user.id,
          },
        };
        const authToken = jwt.sign(data, JWT_SECREAT, { expiresIn: 60 });
        console.log(authToken);
        // res.json(user);
        res.json(authToken);
      }
    } catch (error) {
      res.status(500).send("internal server error occured");
      console.log(error.message);
    }

    // console.log(req.body);
    // const user=User(req.body)
    // user.save()
    // res.send("hello")
  }
);

//Route2: Authenticate a User using : POST "/api/auth/loginuser". No Login Require

router.post(
  "/loginuser",
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  async (req, res) => {
    //If there are errors then send bad request with message
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credential" });
      }
      const passwordCompire = await bcrypt.compare(password, user.password);
      if (!passwordCompire) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credential" });
      }
      //sending authtoken to the user in response
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECREAT);
      // res.json(user);
      res.json(authToken);
      console.log(authToken);
    } catch (error) {
      res.status(500).send("internal server error occured");
      console.log(error.message);
    }
  }
);

//Route3: Get loggedin User Details using : GET "/api/auth/getuser". Login Require
router.get(
  "/getuser",fetchUser,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user)
    } catch (error) {
      res.status(500).send("internal server error occured");
      console.log(error.message);
    }
  }
);

module.exports = router;
