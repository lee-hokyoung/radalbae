const express = require('express');
const router = express.Router();
const sessionModel = require('../model/sessionModel');

router.get('/confirm', async(req, res) => {
  res.render('session_confirm');
});
// 해당 기기로 로그인
router.get('/this', async(req, res) => {
  let session_id = req.session.id;
  let user_id = req.session.passport.user;
  let sessions = await sessionModel.find({});
  let connected_user = sessions.map((v) => {
    let obj = {};
    obj['session_id'] = v._id;
    let passport = JSON.parse(v.session).passport;
    obj['user_id'] = (passport?passport.user:'');
    return obj;
  });
  connected_user.forEach(async (v) => {
    // 세션 아이디는 다르지만 사용자 아이디가 같을 때, 다른 기기에서 접속한 것으로 간주
    if(v.session_id !== session_id && v.user_id === user_id){
      let result = await sessionModel.deleteOne({_id:v.session_id});
    }
  });
  res.redirect('/');
});
// 기존 로그인 유지
router.get('/original', async (req, res) => {
  req.session.destroy();
  res.redirect('/');
});
module.exports = router;
