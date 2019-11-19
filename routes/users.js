const express = require('express');
const router = express.Router();
const User = require('../model/userModel');
const passport = require('passport');
const jwt = require('jsonwebtoken');
/* 회원가입 */
router.get('/register', (req, res) => {
  res.render('user_register');
});
router.post('/register', async (req, res) => {
  const {user_id, user_pw} = req.body;
  const exists = await User.findByUserId(user_id);
  console.log('exists : ', exists);
  if(exists){
    res.json({message:'이미 등록되어 있는 아이디 입니다.', code:2});
    return false;
  }
  const user = new User({
    user_id:user_id,
  });
  let hash_pw = await user.setPassword(user_pw);
  user.user_pw = hash_pw;
  await user.save();
  res.json({message:'회원가입을 환영합니다.', code:1});
});

/*  로그인 */
router.get('/login', (req, res) => {
  res.render('user_login');
});
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {session:false}, (authError, user, info)=>{
    console.log('info : ', info);
    // if(info){
    //     return res.send('<script>alert("' + info.message + '"); location.href = "/auth/login";</script>');
    // }
    if(authError){
      console.error(authError);
      return next(authError);
    }
    if(!user){
      console.log('not user');
      return res.redirect('/auth/login');
    }
    return req.login(user, {session:false}, async (loginError) => {
      if(loginError){
        console.error(loginError);
        return next(loginError);
      }
      let payload = {
        status:user.status,
        user_id:user.user_id,
        user_lv:user.user_lv,
        admin:user.admin,
        _id:user._id
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET,
        {expiresIn:'1d', issuer:'radalbae', subject:'userInfo'});
      await User.updateOne({user_id:user.user_id}, {token:token});
      console.log('token : ', token);
      res.cookie('access_token', token, {
        maxAge:1000*60*60,
        httpOnly:true
      });
      res.redirect('/');
      // req.headers.authorization = token;
      // res.set('Authorization', token);
      // res.cookie('x-auth-token', token);
      // console.log('result : ', result);
      // res.cookie('x-auth-token', token).json({token});
      // res.header("x-auth-token", token).send({
      //     user_id: user.user_id,
      //     user_lv: user.lv,
      //     user_state: user.user_state
      // });
      // return res.cookie('x-auth-token', token);
    });
  })(req, res, next);
});
/*  로그아웃*/
router.get('/logout', (req, res) => {
  let token = req.cookies.access_token;
  if(token){
    res.clearCookie('access_token');
  }
  res.redirect('/');
});
module.exports = router;
