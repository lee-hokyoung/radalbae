const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardSchema = new Schema({
  boardType: {type: String, required: true},
  title: {type: String, required: true},
  writer: {type: String, required: true},
  content: {type: String, required: true},
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  created_at: {type: Date, default: Date.now},
  hit_count: {type: Number, default: 0},
  reply: [
    {
      _id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      name: String,
      content: String,
      created_at: {type: Date, default: Date.now}
    }
  ]
});
module.exports = mongoose.model('Board', boardSchema);