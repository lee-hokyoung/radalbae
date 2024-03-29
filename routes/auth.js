const express = require('express');
const passport = require('passport');
const {isLoggedIn, isNotLoggedIn} = require('./middleware');
const userModel = require('../model/userModel');
const sessionModel = require('../model/sessionModel');

const router = express.Router();
router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao', {failureRedirect: '/'}), async (req, res) => {
  let session_id = req.session.id;
  let user_id = req.session.passport.user;
  // session 에 로그인 된 id 가 있는지 먼저 확인
  let sessions = await sessionModel.find({});
  let connected_user = sessions.map((v) => {
    let obj = {};
    obj['session_id'] = v._id;
    let passport = JSON.parse(v.session).passport;
    obj['user_id'] = (passport?passport.user:'');
    return obj;
  });
  console.log('connected uesr : ', connected_user);
  let isAnotherSession = false;
  connected_user.forEach(async (v) => {
    // 세션 아이디는 다르지만 사용자 아이디가 같을 때, 다른 기기에서 접속한 것으로 간주
    if(v.session_id !== session_id && v.user_id === user_id){
      isAnotherSession = true;
    }
  });
  if(isAnotherSession) res.redirect('/session/confirm');
  else res.redirect('/');
});

module.exports = router;