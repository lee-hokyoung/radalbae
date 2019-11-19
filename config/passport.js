const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('../model/userModel');
require('dotenv').config();

module.exports = () => {
  passport.use(new LocalStrategy({
      usernameField: 'user_id',
      passwordField: 'user_pw'
    },
    (user_id, password, done) => {
      return UserModel.findOne({user_id: user_id})
        .then(user => {
          if (!user) {
            return done(null, false, {message: '잘못된 정보입니다.'});
          }
          return done(null, user, {message: '로그인 성공'});
        }).catch(err => done(err));
    }
  ));
  passport.use(new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    (jwtPayload, done) => {
      console.log('payload : ', jwtPayload);
      console.log('done : ', done);
      return UserModel.findOne({user_id: jwtPayload.id})
        .then(user => {
          return done(null, user)
        })
        .catch(err => {
          return done(err)
        });
    }));
};