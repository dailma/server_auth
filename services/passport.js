//helps authenticate user when they visit routes which require it

const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//**note: 'done' callback is supplied by passport

//Create local strategy
const localOptions = {usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  //verify username and PW, call callback with user if it is correct username/PW, otherwise
  //callback w/ false
  User.findOne({ email: email }, function(err, user) {
    if(err){ return done(err); }
    if(!user){ return done(null, false); }

    user.comparePassword(password, function(err, isMatch){
      if(err){ return done(err); }
      if(!isMatch) { return done(null, false); }
    });
  });
});

//Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

//Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, callback){
//see if user ID in payload exists in DB, if it does, calls 'callback' with
//that user, otherwise call callback without a user object
  User.findById(payload.sub, function(err, user){
    if(err){ return callback(err, false); }

    if(user){
      callback(null, user);
    }else{
      callback(null, false);
    }
  });
});

//tell passport to use this strat
passport.use(jwtLogin);
passport.use(localLogin);
