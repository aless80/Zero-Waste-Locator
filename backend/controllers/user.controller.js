const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

// Retrieve all stores from the database.
exports.findAll = (req, res) => {
  User.find((err, users) => {
      if (err)
    res.status(400).send('Failed to fetch users\n' + res.json(err));
      else
        res.json(users);
  })
}

exports.update = (req, res) => {
  // Check if username already exists
  User.getUserByUsername(req.body.username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'Username does not exist'});
    } else {
      var userid = user.id;
      var userobj = {};
      userobj.id = user.id;
      userobj.username = req.body.username;
      userobj.name = req.body.name;
      userobj.email = req.body.email;
      if (req.body.password){
        userobj.password = req.body.password;
        User.updateUser(userobj, (err, user) => {
          if(err){
            res.json({success: false, msg: 'Failed to update user'});
          } else {
            res.json({success: true, msg: 'User updated'});
          }
        });
      };
    }
  });
}

exports.register = (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });
  // Check if username already exists
  User.getUserByUsername(newUser.username, (err, user) => {
    if(err) {
      throw err
    }
    if(user){
      return res.json({success: false, msg: 'Username already exists'});
    } else {
      User.addUser(newUser, (err, user) => {
        if(err){
          console.log('Failed to register user:',err)
          res.json({success: false, msg: 'Failed to register user'});
        } else {
          res.json({success: true, msg: 'User registered'});
        }
      });
    }
  });
}

exports.authenticate = (req, res, next) => {
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
          expiresIn: 3600
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
}

exports.profile = (req, res, next) => {
  res.json({user: req.user});
}

//Add the date and time of a new geolocation search carried out by a user
exports.logSearch = (req, res) => {
  User.getUserByUsername(req.body.username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'Username '+req.body.username+' does not exist'});
    } else {
      const query = {username: req.body.username};
      User.updateOne(query, 
        {$push: {searches: Date()}},
        (err, rawResponse) => {
          if(err){
            res.json({success: false, msg: 'Failed to push date of search to user'});
          } else {
            res.json({success: true, msg: 'Successfully pushed date to searches field for user ' + req.body.username});
          }
        }
      );
    }
  })
}

// Delete a store with the specified id in the request
// Not used in front end but useful for admins
exports.delete = (req, res) => {
  User.findByIdAndRemove({_id: req.params.id }, (err, store) => {
    if (err) {
      res.json(err);
    } else {
      if (store) {
        res.json('Removed Successfully');
      } else {
        res.json('Id not found');}
      }
     });
  }
  