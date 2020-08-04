var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/control.html');
});

// io.on('connection', (socket) => {
//   console.log('a user connected');
// });
io.on('connection', (socket) => {
    console.log("connected");
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
 
    });
    setInterval(emmit,3000);
    
   function emmit() {
     socket.emit('car numbers', {
      a1:1,
      a2:1,
      b1:1,
      b2:1
    });
   }
  });
http.listen(3000, () => {
  console.log('listening on *:3000');
});