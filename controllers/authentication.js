const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user){
  const timestamp = new Date().getTime();
  //JWT by convention has a 'sub' property - subject
  //this says the 'subject' of this token is this user.id
  //iat is 'issued at time'
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.login = function(req, res, next){
  //Email and PW already auth'd, give them token
  res.send({ token: tokenForUser(req.user) });
}

exports.register = function(req, res, next){
  const firstName = req.body.first_name;
  const lastName = req.body.last_name;
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password){
    return res.status(422).send({error : 'Email and Password must be provided'});
  }


  //check if email already exists, if it does, return error.
  User.findOne({email : email}, function(err, existingUser){
    if(err){ return next(err); }
    if(existingUser){
      //status 422
      return res.status(422).send({error: 'Email is in use'});
    }
    //else, create new user and save
    const user = new User({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password
    });

    user.save(function(err){
      if(err){ return next(err); }

      //response indicating user was created
      res.json({ success: true });
    });

  });

}
