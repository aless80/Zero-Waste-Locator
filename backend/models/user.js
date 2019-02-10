const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique : true
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  reset_password_token: String,
  reset_password_expires: Date,
  date: {
    type: Date,
    default: Date.now
  },
  searches: {
    type: [Date], 
    requires: false,
    default: []},
});

/*
UserSchema.pre('save', true, function(next) {
  var user = this;
  console.log('pre')
  console.log(user.isModified('password'))
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});
*/
// module.exports so that it can be used outside this file
const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
  const query = {username: username};
  User.findOne(query, callback);
}

module.exports.getUserByEmail = function(email, callback){
  const query = {email: email};
  User.findOne(query, callback);
}

//Add user with encrypted password
module.exports.addUser = function(userobj, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(userobj.password, salt, (err, hash) => {
      // Store hash in the password DB
      if(err) throw err;
      userobj.password = hash;
      userobj.save(callback);
    });
  });
}

//Update user with encrypted password
//Note: it sucks that this bcrypt code is duplicated, 
//but I could not make a UserSchema.pre('save' ..) work
module.exports.updateUser = function(userobj, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(userobj.password, salt, (err, hash) => {
      // Store hash as the User's password DB
      if(err) throw err;
      userobj.password = hash;
      User.findByIdAndUpdate(userobj.id, userobj, callback);
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}
