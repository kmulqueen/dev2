const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("./keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      // Get user who is being sent through token
      User.findById(jwt_payload.id)
        .then(user => {
          // If user is found, return done function w/ user as 2nd param
          if (user) {
            return done(null, user);
          }
          // If no user found, return false
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
