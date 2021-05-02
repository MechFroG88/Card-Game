const express = require('express');
const http = require('http');
const cors = require('cors');

// Creating express app, and hosting it on a http server
const app = express();
const server = http.createServer(app);

// Instantiating a socket
const { Server } = require("socket.io");
const socketOptions = {
  cors: {
    origin: "http://localhost:5000",
  }
};
const io = new Server(server, socketOptions);

app.use(cors());

const PORT = 3000;
let msgs = [];

io.on('connection', (socket) => {
  io.emit('chat message', msgs);

  socket.on('disconnect', () => { });

  socket.on('chat message', (msg) => {
    console.log(`message sent: ${msg}`);
    msgs.push(msg);
    io.emit('chat message', msgs);
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
