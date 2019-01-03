const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const User = require('../models/User')

// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const passport = require('passport');

router.get('/', (req, res) => {
  User.find((err, users) => {
    if (err)
      res.status(400).send('Failed to fetch users\n' + res.json(err));
    else
      res.json(users);
  })
})

// Register - /users/register
router.post('/register', (req, res, next) => {
  // res.send('REGISTER');
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  // Check if username already exists
  User.getUserByUsername(newUser.username, (err, user) => {
    if(err) throw err;

    if(user){
      return res.json({success: false, msg: 'Username already exists'});
    } else {
      User.addUser(newUser, (err, user) => {
        if(err){
          res.json({success: false, msg: 'Fail to register user'});
        } else {
          res.json({success: true, msg: 'User registered'});
        }
      });    
    }
  });

/*  
  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg: 'Fail to register user'});
    } else {
      res.json({success: true, msg: 'User registered'});
    }
  });
*/
});

// Authenticate - /users/authenticate
router.post('/authenticate', (req, res, next) => {
  // res.send('AUTHENTICATE');
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;

    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;

      if(isMatch){
        // Need toJSON() or Error: Expected "payload" to be a plain object
        // https://github.com/bradtraversy/nodeauthapp/issues/3
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 604800// 1 week in seconds
        });

        res.json({
          success: true,
          token: 'JWT ' + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        })
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// Profile - /users/profile
// NB: to test this use token gotten from /authenticate, and put it in headers
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  // res.send('PROFILE');
  res.json({user: req.user});
});

module.exports = router;
