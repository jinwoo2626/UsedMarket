const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  idemail: {type: String, required: true},  //회원아이디
  password: {type: String, required: true}, //회원비밀번호
  name: {type: String, required: true},     //회원명
  phone: {type: String, required: true},    //회원전화번호
  money: {type: Number, required: true}     //회원보유금액
});

module.exports = mongoose.model("User", userSchema);
