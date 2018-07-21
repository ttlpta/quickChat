const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const socket = require('./socket');
socket();
const port = 3001;
 
app.set('view engine', 'html');
app.use(cors());   
app.use(bodyParser.json());
app.use(express.static(__dirname + '/quick-chat/build'));
app.use('/avatar', express.static(__dirname + '/uploads/avatars'));


const mongoose = require('mongoose');
mongoose.connect('mongodb://mongodb/quickchat');
const routes = require('./app');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  routes(app);
  http.listen(port, function(){
    console.log('listeninggggg on *:' + port);
  });
});
