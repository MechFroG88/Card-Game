import { Room, Event } from "../types";
const { Server } = require("socket.io");

const socketOptions = {
  cors: {
    origin: "http://localhost:5000",
  }
};

module.exports = (server : any, rooms : { [key : string] : Room }) => {
  const io = new Server(server, socketOptions);

  io.on(Event.connection, (socket : SocketIO.Socket)  => {
    require('./controller/room')(io, socket, rooms);
  });
}; 