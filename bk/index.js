var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var chat = io.of('/chat'); //Namespace

chat.on('connection', function (socket) {
  socket.on('room', function(room){
    socket.join(room);
  });

  socket.on('chat message', function(data){
    socket.to(data.room).emit('chat message 2', data.msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
