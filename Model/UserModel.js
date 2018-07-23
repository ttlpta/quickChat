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
  description : String,
  type: Number,
  status : { type : Number, default : configs.OFFLINE },
  contacts : [{ id : mongoose.Schema.Types.ObjectId, name : String, avatar : String, description : String, block : Boolean, love : Boolean }]
});

userShema.index({ email : 'text', firstname : 'text', lastname : 'text' });
module.exports = mongoose.model('User', userShema);
