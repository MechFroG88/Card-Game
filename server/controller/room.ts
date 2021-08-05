import { Player, Room, Event, State } from "../../types";
import { makeid } from "../helper";


module.exports = (io : any, socket : SocketIO.Socket, rooms : { [key : string] : Room }) => {
  let data = socket.handshake.query;
  let roomId = data.roomId;
  let userId = data.userId;
  let name = data.name;

  /**
   * Check if room exists
   */
  if (!(roomId in rooms)) {
    socket.emit(Event.error, "Room does not exist");
    return;
  }

  let room = rooms[roomId];
  if (room.findPlayer(userId) === undefined && !room.wait()) {
    socket.emit(Event.error, "The game is still going on. Please come back later");
    return;
  }

  let player = room.findPlayer(userId) || new Player(makeid(10), name, socket.id, room.counter++);

  userId = player.id;
  
  room.addPlayer(player);

  player.socketId = socket.id;

  /**
   * Join the user to socket room
   */
  socket.join(roomId);

  socket.emit(Event.connection, player.privateBasicData());

  var countdown = () => {
    if (room.ready()) {
      io.in(roomId).emit(Event.countdownStart);
      room.countdown = setTimeout(() => {
        room.nextState();
        updateRoom();
      }, 3000);
    }
  }

  var updateRoom = () => {
    // All player getSelf
    for (const [_, player] of Object.entries(room.players)) {
      io.to(player.socketId).emit(Event.getRoom, 
        {room : room.toJson(), self : getPlayerData(player)});
    }
    // Update room
    clearTimeout(room.countdown);
    io.in(roomId).emit(Event.countdownStop);
    if (room.ready()) {
      countdown();
    } 
  }

  const getPlayerData = (player : Player) => {
    if (room.wait()) {
      return player?.privateBasicData();
    } else {
      return player?.privateData();
    }
  }

  /**
   * Broadcast to everyone in the room to update
   */
  updateRoom();

  /**
   * Leave Room Event
   */
  socket.on(Event.leaveRoom, () => {
    if (player !== undefined) {
      room.removePlayer(player.id);
    }
    updateRoom();
  });

  /**
   * Get Ready Event
   */
   socket.on(Event.getReady, () => {
    player.ready = !player.ready;
    updateRoom();
  });

  /**
   * Change Config Event
   */
  socket.on(Event.changeConfig, data => {
    room.changeConfig(data.traitor, data.rebel, data.minister);
    updateRoom();
  });

  /**
   * Get Self Event
   */
  socket.on(Event.getSelf, () => {
    socket.emit(Event.getSelf, getPlayerData(player));
  });

  socket.on(Event.bid, data => {
    room.bid(userId, data);
    updateRoom();
  })

  socket.on(Event.pick, data => {
    room.play(userId, data);
    updateRoom();
  })

}