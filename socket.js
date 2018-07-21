const io = require('socket.io')();
io.attach(3003);

const socket = () => {
  io.on('connect', socket => {
    console.log('===>', 'Socket connected');
    socket.on('update_status_user', function(data){
      io.emit('update_status_user', data)
    })
  });
  
}

module.exports = socket;


// io.attach(3003);
// io.on('connect', function(socket){
//   //Validate connect socket
//   console.log('socket connected')
//   socket.on('update_status_user', function(data){
//     console.log('==>', data);
//     io.emit('update_status_user', data)
//   })
// });
// var chat = io.of('/chat'); //Namespace

// chat.on('connection', function (socket) {
//   socket.on('room', function(room){
//     socket.join(room);
//   });d

//   socket.on('chat message', function(data){
//     socket.to(data.room).emit('chat message 2', data.msg);
//   });
// });