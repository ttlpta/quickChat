const mongoose = require('mongoose');

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
});

module.exports = mongoose.model('User', userShema);
