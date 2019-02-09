const express = require('express');
const router = express.Router();
const passport = require('passport');
//const jwt = require('jsonwebtoken');
//const config = require('../config/database');
//const User = require('../models/User');
const controller = require('../controllers/user.controller.js');

// Retrieve all users
router.get('/users', controller.findAll)

// Register - /users/register
router.post('/users/register', controller.register)

// Update - /users/update
router.post('/users/update', controller.update)

// Delete user
router.get('/users/delete/:id', controller.delete);

// Authenticate - /users/authenticate
router.post('/users/authenticate', controller.authenticate)

// Profile - /users/profile
// NB: to test this use token gotten from /authenticate, and put it in headers
router.get('/users/profile', passport.authenticate('jwt', {session: false}), controller.profile)

//Log geolocation search from user
router.post('/users/logsearch', controller.logSearch)

//Log geolocation search from user
router.post('/users/searchstats', controller.searchstats)

//Forgot password functionality
router.get('/users/forgot_password', controller.render_forgot_password_template);
router.post('/users/forgot_password', controller.forgot_password);

//Reset password functionality
router.get('/users/reset_password', controller.render_reset_password_template);
router.post('/users/reset_password', controller.reset_password);

module.exports = router;