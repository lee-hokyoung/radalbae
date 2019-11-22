const express = require('express');
const router = express.Router();
const middle = require('./middleware');
const boardModel = require('../model/boardModel');
const mongoose = require('mongoose');

const getTitle = (boardType) => {
  let title = '';
  switch (boardType) {
    case 'entire':
      title = '전체글';
      break;
    case 'freeBoard':
      title = '자유게시판';
      break;
    case 'wedding':
      title = '예신들의 결혼준비';
      break;
    case 'honeymoon':
      title = '주부선배 신혼생활';
      break;
    case 'tips':
      title = '주방요리꿀팁';
      break;
    case 'wisdom':
      title = '생활의 지혜';
      break;
    case 'recommend':
      title = '가성비갑 추천추천';
      break;
  }
  return title;
};

// 게시판 list
router.get('/:boardType', async (req, res) => {
  let user = res.locals.user_info;
  let boardType = req.params.boardType;
  let query = {};
  console.log('user : ', user);
  if(boardType!=='entire') query = {boardType:boardType};
  let list = await boardModel.find(query).sort({created_at: -1});
  res.render('board', {
    title: getTitle(boardType),
    side: boardType,
    user: user,
    list: list
  });
});
// 글 쓰기 화면으로 이동
router.get('/write/:boardType', middle.checkAuth, (req, res) => {
  let user = res.locals.user_info;
  let boardType = req.params.boardType;
  res.render('board_write', {
    title: getTitle(boardType),
    user: user,
    side: boardType,
  })
});
// 글 쓰기
router.post('/:boardType', middle.checkAuth, async (req, res) => {
  let user = res.locals.user_info;
  console.log('user : ', user);
  let boardType = req.params.boardType;
  let {title, writer, content} = req.body;
  let board = new boardModel({
    title: title,
    writer: writer,
    content: content,
    boardType: boardType,
    user_id: user._id
  });
  let result = await board.save();
  res.json(result);
});
// 글 읽기
router.get('/read/:id', async (req, res) => {
  let id = req.params.id;
  let doc = await boardModel.findOne({_id: id});
  console.log('doc : ', doc);
  // 조회수 올리기
  await boardModel.updateOne({_id: id}, {hit_count: doc.hit_count + 1});
  res.render('board_read', {
    doc: doc
  })
});
// 댓글 달기
router.post('/reply/:content_id', middle.checkAuth, async (req, res) => {
  let user = res.locals.user_info;
  if (!user) {
    res.json({message: '사용자 정보가 없습니다. ', code: -1});
    return false;
  }
  let result = await boardModel.updateOne({_id: mongoose.Types.ObjectId(req.params.content_id)},
    {
      $push: {
        reply: {
          _id: user._id,
          name: req.body.name,
          pw: req.body.pw,
          content: req.body.content
        }
      }
    });
  res.json({message: '입력완료', code: 1, result: result});
});
module.exports = router;
