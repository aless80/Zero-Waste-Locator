const express = require('express');
const router = express.Router();
const passport = require('passport');
//const jwt = require('jsonwebtoken');
//const config = require('../config/database');
//const User = require('../models/User');
const controller = require('../controllers/user.controller.js');

// Retrieve all users
router.get('/', controller.findAll)

// Register - /users/register
router.post('/register', controller.register)

// Authenticate - /users/authenticate
router.post('/authenticate', controller.authenticate)

// Profile - /users/profile
// NB: to test this use token gotten from /authenticate, and put it in headers
router.get('/profile', passport.authenticate('jwt', {session: false}), controller.profile)

module.exports = router;
