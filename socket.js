const io = require('socket.io')();
io.attach(3003);

module.exports = io;
