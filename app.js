const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
const _ = require('lodash');

const user = require('./routes/user');
const helpers = require('./helper');

const upload = multer({ dest: "./tmp" }).single('avatar');
module.exports = app => {
  app.use((err, req, res, next) => { // Error
    res.status(err.status || 500);
    if (err.errors && Object.keys(err.errors).length) {
      res.json({
        error: true,
        errors: err.errors || {},
      });
    } else {
      res.send(err.message);
    }
  });
  app.use('/api/auth/*', function (req, res, next) {
    const token = req.get('Authorization');
    if(!token)
      return res.status(403).end();
      
    try {
      const decoded = helpers.verifyJwtToken(token);
      var currentTime = Date.now() / 1000;
      
      if(decoded.exp < currentTime)
        return res.status(403).end();

      const userId = req.body.user_id || req.query.user_id;
      req.user_id = userId ? userId : decoded.id;
    } catch(err) {
      return res.status(403).json(err);
    }
    next();
  });

  app.use('/api(/auth)?/user', user);

  app.get('*', function(req, res){
    res.sendFile(__dirname + '/quick-chat/build/index.html');
  });

  app.post('/api/auth/files', (req, res) => {
    upload(req, res, function(err) {
      
      if(err) 
        return res.status(400).end();
      let transform = sharp();
      transform = transform.resize(450, 450).crop(sharp.strategy.center);
      const readStream = fs.createReadStream(req.file.path);
      const mapType = {
        'image/jpeg' : 'jpg',
        'image/jpg' : 'jpg',
        'image/png' : 'png',
      }
      const type = _.isUndefined(mapType[req.file.mimetype]) ? 'png' : mapType[req.file.mimetype];
      const filename = `${req.user_id}_${Date.now()}.${mapType[req.file.mimetype]}`;
      readStream.pipe(transform).pipe(fs.createWriteStream(`uploads/avatars/avatar_${filename}`))
      
      return res.json(helpers.success({ imageUrl : `avatar_${filename}` }));
    });
  });
};