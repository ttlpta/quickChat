const mongoose = require('mongoose');

const configs = require('../configs');

const userShema = mongoose.Schema({
  email: { type : String, unique: true, required: [true, 'Email is required'] },
  password: { type : String, required: [true, 'Password is required'] },
  expriedTime : String,
  firstname : { type : String, required: [true, 'Firstname is required'] },
  lastname: { type : String, required: [true, 'Lastname is required'] },
  fbId: String,
  ggId: String,
  avatar: String,
  type: Number,
  status : { type : Number, default : configs.OFFLINE }
});

module.exports = mongoose.model('User', userShema);
