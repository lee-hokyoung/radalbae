const express = require('express');
const passport = require('passport');
const {isLoggedIn, isNotLoggedIn} = require('./middleware');
const userModel = require('../model/userModel');

const router = express.Router();
router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao', {failureRedirect: '/'}), (req, res) => {
  res.redirect('/');
});

module.exports = router;