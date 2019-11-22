const express = require('express');
const router = express.Router();
const middle = require('./middleware');
const boardModel = require('../model/boardModel');
const mongoose = require('mongoose');

// kakao login
router.get('/:boardType', async (req, res) => {
});
module.exports = router;
