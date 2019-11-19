const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

exports.checkAuth = async (req, res, next) => {
  let token = req.cookies.access_token;

  if (!token) {
    console.log('토큰 없음');
    res.redirect('/users/login');
  } else {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decode : ', decoded);
    if (!decoded) {
      console.log('토큰 정보가 다름... 리다이렉트');
      res.redirect('/users/login');
    } else {
      let user = await User.findOne({user_id: decoded.user_id});
      if (!user) {
        console.log('유저정보 없음');
        res.redirect('/users/login');
      } else {
        res.locals.user_info = decoded;
        next();
      }
    }
  }
};