const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/config');

module.exports = function(passport){
    let opts = {};
		// Error: ExtractJwt.fromAuthHeader is not a function
		// https://github.com/bradtraversy/meanauthapp/issues/9
    // opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    // opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.mongoDBsecret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
      // console.log(jwt_payload);
      User.getUserById(jwt_payload._id, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
      });
    }));
}
