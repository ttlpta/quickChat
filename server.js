const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const io = require('./socket');
const port = 3001;
 
app.set('view engine', 'html');

app.use(cors());   
app.use(bodyParser.json());
app.use(express.static(__dirname + '/quick-chat/build'));
app.use('/avatar', express.static(__dirname + '/uploads/avatars'));
io.on('connection', function(socket){

  socket.on('chat message', function(msg){
    console.log(msg);
  });
  
});
// var chat = io.of('/chat'); //Namespace

// chat.on('connection', function (socket) {
//   socket.on('room', function(room){
//     socket.join(room);
//   });d

//   socket.on('chat message', function(data){
//     socket.to(data.room).emit('chat message 2', data.msg);
//   });
// });
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
