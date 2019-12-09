const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SessionSchema = new Schema({
  _id:String,
  expires:{type:Date},
  session:String,
  token:String
});
module.exports = mongoose.model('session', SessionSchema);