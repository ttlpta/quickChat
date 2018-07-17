const jwt = require('jsonwebtoken');
const configs = require('./configs');
const moment = require('moment');

module.exports = {
  getJwtToken : (id, keepLogin = false) => {
    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);
    const expiredTime = moment().format();
    
    return {
      token : jwt.sign({ id }, configs.jwtToken, {
        expiresIn: keepLogin ? configs.jwtExpiredLongTine : configs.jwtExpiredTine // expires in 24 hours
      }),
      expiredTime
    }
  },
  verifyJwtToken : token => {
    return jwt.verify(token, configs.jwtToken);
  },
  getCurrentUnixTime : () => {
    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);
    
    return timestamp;
  },
  isExpiredTime : unixTime => {
    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);

    return unixTime < timestamp
  },
  success : ( data, code = 0 ) => ({ success: true, code , data }),
  fail : message => ({ message })
}
