const express = require('express');
const app = express();
const http = require('http').Server(app);
// var io = require('socket.io')(http);
const port = 3001;
app.use(express.static(__dirname + '/quick-chat/build'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/quick-chat/build/index.html');
});

// var chat = io.of('/chat'); //Namespace

// chat.on('connection', function (socket) {
//   socket.on('room', function(room){
//     socket.join(room);
//   });

//   socket.on('chat message', function(data){
//     socket.to(data.room).emit('chat message 2', data.msg);
//   });
// });

http.listen(port, function(){
  console.log('listeninggggg on *:' + port);
});
