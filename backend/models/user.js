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
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  searches: {
    type: [Date], 
    requires: false,
    default: []},
});

// module.exports so that it can be used outside this file
const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
  const query = {username: username};
  User.findOne(query, callback);
}

//Add user with encrypted password
module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      // Store hash in the password DB
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

//Update user with encrypted password
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
