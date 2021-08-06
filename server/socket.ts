import { Room, Event } from "../types";
const { Server } = require("socket.io");

const socketOptions = {
  cors: {
    origin: "*",
  }
};

module.exports = (server : any, rooms : { [key : string] : Room }) => {
  const io = new Server(server, socketOptions);

  io.on(Event.connection, (socket : any)  => {
    require('./controller/room')(io, socket, rooms);
  });
}; 