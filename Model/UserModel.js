const mongoose = require('mongoose');

const userShema = mongoose.Schema({
  email: { type : String, unique: true, required: true },
  password: { type : String, required: true },
  expriedTime : String,
  firstname : { type : String, required: true },
  lastname: { type : String, required: true },
  fbId: String,
  ggId: String,
  avatar: String,
  type: Number,
});

module.exports = mongoose.model('User', userShema);
