const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');
const UserSchema = new Schema({
  user_id:{type:String, required:true, unique:true},
  user_name:{type:String},
  user_pw:{type:String, required:true},
  admin:{type:Boolean, default:false},
  user_lv:{type:Number, default: 1},
  created_at:{type:Date, default:Date.now},
  status:{type:Number, default:1},
  snsId:String,
  provider:String,
  profile_image:String,
  thumbnail_image:String,
  email:String,
  age_range:String,
  birthday:String,
  gender:String
});
UserSchema.methods.setPassword = async function(pwd){
  const hash = await bcrypt.hash(pwd, 10);
  this.hashedPassword = hash;
  return hash;
};
UserSchema.methods.checkPassword = async function(pwd){
  const result = await bcrypt.compare(pwd, this.hashedPassword);
  return result;  // true, false
};
UserSchema.statics.findByUserId = function(user_id){
  return this.findOne({user_id});
};
UserSchema.methods.serialize = function(){
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};
module.exports = mongoose.model('User', UserSchema);