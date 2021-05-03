const express = require('express');
const http = require('http');
const cors = require('cors');

import { Player } from "../types";

let a = new Player("a");
a.hasID("b");

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

const PORT:number = 3000;

type Message = {
  text:string;
  id:string;
};
let msgs:Array<Message> = [];


io.on('connection', (socket:SocketIO.Socket) => {
  io.emit('chat message', msgs);

  socket.on('disconnect', () => { });

  socket.on('chat message', (msg:string) => {
    console.log(`message sent by ${socket.id}: ${msg}`);
    msgs.push({ text: msg, id: socket.id });
    socket.broadcast.emit('chat message', msgs);
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
