const _ = require('lodash');

const io = require('../socket');
const configs = require('../configs');
const helpers = require('../helper');
const userModel = require('../Model/UserModel');

let UserController = function () {};

UserController.prototype.regist = async (req, res, next) => {
  try{
    const base64Pw = _.isUndefined(req.body.password) ? '' : new Buffer(req.body.password).toString('base64');
    const expriedTime = helpers.getCurrentUnixTime() + configs.jwtExpiredTine * 60;
    const user = new userModel({...req.body, password : base64Pw, expriedTime });
    const userSaved = await user.save();
    const token = helpers.getJwtToken(userSaved._id);

    return res.json(helpers.success({ ...token, id : userSaved._id }));
  } catch(err) {
    return res.status(400).json(helpers.fail(err.code == 11000 ? 'Email is existed' : err.message));
  }
}

UserController.prototype.loginFb = async (req, res, next) => {
  const { email } = req.body;
  try {
    const userData = await userModel.findOne({ email }).select('id token').exec();
    if(userData)
      return res.json(helpers.success({ ...helpers.getJwtToken(userData._id), id : userData._id }));
    
    const expriedTime = helpers.getCurrentUnixTime() + configs.jwtExpiredTine * 60;
    const user = new userModel({ ...req.body, password: 'na', expriedTime, type : configs.NO_TYPE });
    const userSaved = await user.save();
    
    return res.json(helpers.success({ ...helpers.getJwtToken(userSaved._id), id : userSaved._id }));
  } catch(err) {
    return res.status(400).json(helpers.fail(err.message));
  }
}

UserController.prototype.login = async (req, res, next) => {
  const base64Pw = _.isUndefined(req.body.password) ? '' : new Buffer(req.body.password).toString('base64');
  const email = _.isUndefined(req.body.email) ? '' : req.body.email;
  const keepLogin = req.body.keepLogin;
  if(!email || !base64Pw)
    return res.status(400).end();

  try {
    let user = await userModel.findOne({ email, password: base64Pw });
    if(_.isEmpty(user))
      return res.status(422).json({ message: 'Email or password is invalid' });
    
    const token = helpers.getJwtToken(user._id, keepLogin);
    const expriedTime = keepLogin ? helpers.getCurrentUnixTime() + configs.jwtExpiredLongTine * 60 
      : helpers.getCurrentUnixTime() + configs.jwtExpiredTine * 60;
    user.set({ 'expriedTime' : expriedTime });
    user = await user.save();
    
    return res.json(helpers.success({id: user._id, ...token}));
  } catch (err) {
    return res.status(400).end();
  }
}

UserController.prototype.logingg = async (req, res, next) => {
  const { email } = req.body;
  try {
    const userData = await userModel.findOne({ email }).select('id').exec();
    if(userData)
      return res.json(helpers.success({ ...helpers.getJwtToken(userData._id), id : userData._id }));
    
    const expriedTime = helpers.getCurrentUnixTime() + configs.jwtExpiredTine * 60;
    const user = new userModel({ ...req.body, password: 'na', expriedTime, type : configs.NO_TYPE });
    const userSaved = await user.save();

    return res.json(helpers.success({ ...helpers.getJwtToken(userSaved._id), id : userSaved._id }));
  } catch(err) {
    return res.status(400).json(helpers.fail(err.message));
  }
}

UserController.prototype.detail = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ _id : req.user_id })
      .select('id firstname lastname email avatar status')
      .exec();
      
    return _.isEmpty(user) ? res.status(422).end() : res.json({ success: true, data: user });
  } catch(err) {
    return res.status(400).end();
  }
}

UserController.prototype.updateProfile = async (req, res, next) => {
  try {
    const body = _.pick(req.body, ['firstname', 'lastname', 'email', 'avatar']);
    const user = await userModel.findByIdAndUpdate(req.user_id, { $set: body }, { new: true }).select('id firstname lastname email avatar');
    return _.isEmpty(user) ? res.status(422).end() : res.json({ success: true, data: user });
  } catch(err) {
    return res.status(400).end();
  }
}

UserController.prototype.updateStatus = async (req, res, next) => {
  try {
    const body = _.pick(req.body, ['status']);
    if(!_.isNull(body.status)) {
      const response = await userModel.updateOne({ _id : req.user_id }, body);

      return response.ok ? res.json({ success: true }) : res.status(400).end();
    }
  
    return res.status(400).end();
  } catch(err) {
    return res.status(400).end();
  }
}

UserController.prototype.logout = async (req, res, next) => {
  try {
    const result = await userModel.update({ _id: req.user_id }, { $set: { expriedTime: helpers.getCurrentUnixTime() }});
    
    return result.ok ? res.json({ success: true }) : res.status(400).end();
  } catch(err) {
    return res.status(400).end();
  }
}

UserController.prototype.listContacts = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user_id);
    
    return user ? res.json({ success: true, data: user.contacts }).end() : res.status(422).end();
  } catch(err) {
    return res.status(400).end();
  }
}

UserController.prototype.addContact = async (req, res, next) => {
  try {
    const partner = await userModel.findById(req.body.partner_id);
    const contact = {
      _id : partner._id,
      name : `${partner.firstname} ${partner.lastname}`,
      avatar : partner.avatar,
      description : partner.description || '',
      avatar : partner.avatar,
      love : false,
      block : false
    };
    console.log('=====aaaaa=>', req.user_id);
    console.log('======>', contact);
    const result = await userModel.update({ _id : req.user_id }, {$push: { contacts : contact }}); 
    console.log('======>', result);
    return result.ok ? res.json({ success: true }) : res.status(400).end();
  } catch(err) {
    return res.status(400).end();
  }
}

UserController.prototype.search = async (req, res, next) => {
  try {
    const searchTxt = req.query.q;
    const user = await userModel.find({$text: { $search: `\"${searchTxt}\"`, $caseSensitive: true }})
      .select('id firstname lastname avatar description status').limit(20);
    
    return user ? res.json({ success: true, data: user }).end() : res.status(422).end();
  } catch(err) {
    console.log(err);
    return res.status(400).end();
  }
}


module.exports = new UserController();
