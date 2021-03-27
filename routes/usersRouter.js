const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Users = require('../models/users');
const jwt = require("jsonwebtoken");

var userRouter = express.Router();

userRouter.use(bodyParser.json());

//get all dishes

userRouter.post('/register', async function(req,res){
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(req.body.password, salt, async(err, hash) => {
        await Users.create({
          'username' : req.body.username,
          'password' : hash,
        });
        console.log("User registered : ", user);

    });
  });
  res.statusCode = 200;
  res.set('content-type', 'application/json');
  res.json({'message' : `${req.body.username} registered`});
});
userRouter.post('/login', async function(req,res){
  var user = await Users.findOne({ username: req.body.username});
  if(user != null){
    // Load hash from the db, which was preivously stored 
    var result = await bcrypt.compare(req.body.password, user.password);
      if(result == true){
        const token = generateAccessToken({ username: req.body.username });
        res.statusCode = 200;
        res.set('content-type', 'application/json');
        res.json({'_token' : token+""});
      }else{
        res.statusCode = 400;
        res.set('content-type', 'application/json');
        res.json({'message' : `LOGIN FAILED`});
      }
    
  }else{
    res.statusCode = 400;
    res.set('content-type', 'application/json');
    res.json({'message' : `LOGIN FAILED`});
  }
  
  
});

//jwt
function generateAccessToken(username) {
  // expires after half and hour (1800 seconds = 30 minutes)
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}
module.exports = userRouter;