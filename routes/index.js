const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const boardModel = require('../model/boardModel');

/* GET home page. */
router.get('/', async (req, res, next) => {
  let user = req.user;
  let access_token = req.cookies.access_token;
  if(access_token){
    let decoded = jwt.verify(access_token, process.env.JWT_SECRET);
    user = decoded;
  }
  let allBoard = await boardModel.aggregate([
    {$match:{}},
    {$sort:{created_at:-1}},
    {$limit:5}
  ]);
  let freeBoard = await boardModel.aggregate([
    {$match:{boardType:'freeBoard'}},
    {$sort:{created_at: -1}},
    {$limit:5}
  ]);
  let wedding = await boardModel.aggregate([
    {$match:{boardType:'wedding'}},
    {$sort:{created_at: -1}},
    {$limit:5}
  ]);
  let honeymoon = await boardModel.aggregate([
    {$match:{boardType:'honeymoon'}},
    {$sort:{created_at: -1}},
    {$limit:5}
  ]);
  let tips = await boardModel.aggregate([
    {$match:{boardType:'tips'}},
    {$sort:{created_at: -1}},
    {$limit:5}
  ]);
  let wisdom = await boardModel.aggregate([
    {$match:{boardType:'wisdom'}},
    {$sort:{created_at: -1}},
    {$limit:5}
  ]);
  let recommend = await boardModel.aggregate([
    {$match:{boardType:'recommend'}},
    {$sort:{created_at: -1}},
    {$limit:5}
  ]);
  res.render('index', {
    title: '라달배에 오신 것을 환영합니다.',
    side:'index',
    user:user,
    allBoard:allBoard,
    freeBoard:freeBoard,
    wedding:wedding,
    honeymoon:honeymoon,
    tips:tips,
    wisdom:wisdom,
    recommend:recommend
  });
});
module.exports = router;
