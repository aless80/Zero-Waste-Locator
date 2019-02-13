const jwt = require("jsonwebtoken");
const User = require("../models/user");
const path = require('path');
const async = require('async');
const crypto = require('crypto');
const hbs = require('nodemailer-express-handlebars');
const email = process.env.MAILER_EMAIL_ID || 'AlessandroMarin80@gmail.com';
const pass = process.env.MAILER_PASSWORD || "12345";
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

//Load configurations
const config = require('../config/config.js');

// Forgot email/reset password functionalities
var smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || "Gmail",
  host: 'smtp.gmail.com',
  port: 465, // false except for port 465
  secure: true,
  auth: {
    user: email,
    pass: pass
  }
});
// Handlebars provides html templates for forgot/reset password functionalities
var handlebarsOptions = {
  viewEngine: 'handlebars',
  viewPath: path.resolve('./templates/'),
  extName: '.html'
};
smtpTransport.use('compile', hbs(handlebarsOptions));

// HTML pages for forgot/reset password functionalities
exports.render_forgot_password_template = (req, res) => {
  return res.sendFile(path.resolve('./public/forgot-password.html'));
};
exports.render_reset_password_template = (req, res) => {
  return res.sendFile(path.resolve('./public/reset-password.html'));
};


// Retrieve all stores from the database.
exports.findAll = (req, res) => {
  User.find((err, users) => {
    if (err) {
      res.status(400).send("Failed to fetch users\n" + res.json(err));
    } else {
      res.json(users);
    }
  });
};

exports.update = (req, res) => {
  // Check if username already exists
  User.getUserByUsername(req.body.username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: "Username does not exist" });
    } else {
      var userid = user.id;
      var userobj = {};
      userobj.id = user.id;
      userobj.username = req.body.username;
      userobj.name = req.body.name;
      userobj.email = req.body.email;
      userobj.password = req.body.password;
      User.updateUser(userobj, (err, user) => {
        if (err) {
          res.json({ success: false, msg: "Failed to update user" });
        } else {
          res.json({ success: true, msg: "User updated" });
        }
      });
    }
  });
};

exports.register = (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });
  async.waterfall([
    // Check if username already exists
    (done) => {
      User.findOne({ username: newUser.username }).exec((err, user) => {
        if (err) {
          throw err;
        }
        if (user != null) {
          done("Username already exists")
        } else {
          done(err, newUser);
        }
      })
    }, 
    // Check if email already exists
    (newUser, done) => {
      User.findOne({ email: newUser.email }).exec((err, user) => {
        if (err) {
          throw err;
        }
        if (user != null) {
          done("Email already exists")
        } else {
          done(err, newUser);
        }
      }); 
    },
    // Go ahead with adding user
    (newUser, done) => {
      User.addUser(newUser, (err, user) => {
        if (err) {
          console.log("Failed to register user:", err);
          done("Failed to register user:  "+err.message)
        } else {
          res.json({ success: true, msg: "User registered" });
        }
      })
    }
    ], (err) => {
    res.json({ success: false, msg: err })
  })
};

exports.authenticate = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: "User not found" });
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        // Need toJSON() or Error: Expected "payload" to be a plain object
        // https://github.com/bradtraversy/nodeauthapp/issues/3
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 3600
        });
        res.json({
          success: true,
          token: "JWT " + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({ success: false, msg: "Wrong password" });
      }
    });
  });
};

exports.profile = (req, res, next) => {
  res.json({ user: req.user });
};

//Add the date and time of a new geolocation search carried out by a user
exports.logSearch = (req, res) => {
  var username = req.body.username;
  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({
        success: false,
        msg: "Username " + username + " does not exist"
      });
    } else {
      const query = { username: username };
      User.updateOne(
        query,
        { $push: { searches: Date() } },
        (err, rawResponse) => {
          if (err) {
            res.json({
              success: false,
              msg: "Failed to push date of search to user"
            });
          } else {
            res.json({
              success: true,
              msg:
              "Successfully pushed date to searches field for user " +
              req.body.username
            });
          }
        }
        );
      }
    });
  };
  
  //Return how often the user geolocation searches
  exports.searchstats = (req, res) => {
    var username = req.body.username;
    User.getUserByUsername(username, (err, user) => {
      if (err) throw err;
      if (!user) {
        return res.json({
          success: false,
          msg: "Username " + username + " does not exist"
        });
      } else {
        //Query how many searches the user did in some periods (1h, ..)
        let now = new Date();
        let onehourago = new Date(now.getTime() - 1000 * 3600 * 1);
        let yesterday = new Date(now.getTime() - 1000 * 3600 * 24);
        User.aggregate([
          { $match: { username: username } },
          {
            $project: {
              _id:0,
              total: { $size: "$searches" },
              lasthour: {
                $size: {
                  $filter: {
                    input: "$searches",
                    as: "search",
                    cond: {
                      $and: [
                        { $gte: ["$$search", onehourago] },
                        { $lte: ["$$search", now] }
                      ]
                    }
                  }
                }
              },
              today: {
                $size: {
                  $filter: {
                    input: "$searches",
                    as: "search",
                    cond: {
                      $and: [
                        { $gte: ["$$search", yesterday] },
                        { $lte: ["$$search", now] }
                      ]
                    }
                  }
                }
              }
            }
          }
        ]).exec((err, data) => {
          if (err) throw err;
          if (data.length == 0) {
            data = [{ total: 0, lasthour: 0, today: 0 }];
          }
          res.json({
            success: true,
            msg:
            "Successfully pushed date to searches field for user " +
            req.body.username,
            data: data[0]
          });
        });
      }
    });
  };
  
  // Delete a store with the specified id in the request
  // Not used in front end but useful for admins
  exports.delete = (req, res) => {
    User.findByIdAndRemove({ _id: req.params.id }, (err, store) => {
      if (err) {
        res.json(err);
      } else {
        if (store) {
          res.json("Removed Successfully");
        } else {
          res.json("Id not found");
        }
      }
    });
  };  
  
  // Forgot password functionality
  // see http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/
  exports.forgot_password = (req, res) => {
    async.waterfall([
      (done) => {
        User.findOne({
          email: {'$regex' : '^'+req.body.email+'$', '$options' : 'i'}
        }).exec((err, user) => {
          if (user) {
            done(err, user);
          } else {
            done('Email not found in database.');
          }
        });
      },
      (user, done) => {
        crypto.randomBytes(20, (err, buffer) => {
          var token = buffer.toString('hex');
          done(err, user, token);
        });
      },
      (user, token, done) => {
        User.findByIdAndUpdate(
          { _id: user._id }, 
          { reset_password_token: token, reset_password_expires: Date.now() + 3600000 })
          .exec(function(err, new_user) {
            done(err, token, new_user);
          });
        },
        (token, user, done) => {
          var data = {
            from: email,
            to: user.email,        
            template: 'forgot-password-email',
            subject: 'Zero Waste Locator - Password recovery',
            context: {
              url: config.protocol+'://'+config.host+':'+config.port+'/users/reset_password?token=' + token,
              name: user.name[0].toUpperCase()+user.name[0].slice(1)
            }
          };
          smtpTransport.sendMail(data, (err) => {
            if (!err) {
              return res.json({ message: 'Please check your email' });
            } else {
              return done(err);
            }
          });
        }    
      ], (err) => {
        return res.status(422).json({ message: err });
      }
      );
  };
  
  // Reset password
  exports.reset_password = (req, res, next) => {
    User.findOne({
      reset_password_token: req.body.token,
      reset_password_expires: {
        $gt: Date.now()
      }
    }).exec((err, user) => {
      if (!err && user) {
        if (req.body.newPassword === req.body.verifyPassword) {
          user.password = req.body.newPassword;
          user.reset_password_token = undefined;
          user.reset_password_expires = undefined;
          user.name=user.name
          //Note: it sucks that this bcrypt code is duplicated, 
          //but I could not make a UserSchema.pre('save' ..) work
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
              // Store hash as the User's password DB
              if(err) throw err;
              user.password = hash;
              user.save((err) => {
                if (err) {
                  return res.status(422).send({
                    message: err
                  });
                } else {
                  var data = {
                    to: user.email,
                    from: email,
                    template: 'reset-password-email',
                    subject: 'Zero Waste Locator - Password Reset Confirmation',
                    context: {
                      url: config.ngprotocol+'://'+config.nghost+':'+config.ngport,
                      name: user.name[0].toUpperCase()+user.name[0].slice(1)
                    }
                  };
                  smtpTransport.sendMail(data, (err) => {
                    if (!err) {
                      return res.json({ message: 'Password reset' });
                    } else {
                      return done(err);
                    }
                  });
                }
              });
            })
          });
        } else {
          return res.status(422).send({
            message: 'Passwords do not match'
          });
        }
      } else {
        return res.status(400).send({
          message: 'Password reset token is invalid or has expired.'
        });
      }
    });
  };