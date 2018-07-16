const multer = require('multer');

const user = require('./routes/user');
const helpers = require('./helper');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    const mapType = {
      'image/jpeg' : 'jpg',
      'image/jpg' : 'jpg',
      'image/png' : 'png',
    }
    callback(null, `${req.user_id}_${Date.now()}.${mapType[file.mimetype]}`);
  }
});

const upload = multer({ storage : storage}).single('avatar');
module.exports = app => {
  app.use((err, req, res, next) => {
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

      req.user_id = decoded.id;
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
      filename = req.file.filename;
      if(err) 
        return res.status(400).end();

      return res.json(helpers.success({ imageUrl : filename }));
    });
  });
};