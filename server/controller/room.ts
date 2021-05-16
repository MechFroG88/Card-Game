import { Player, Room, Event, Time } from "../../types";
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
  let player = room.findPlayer(userId) || new Player(makeid(10), name, socket.id);

  userId = player.id;

  room.addPlayer(player);

  player.socketId = socket.id;

  let roomMaster = room.isRoomMaster(player);

  /**
   * Join the user to socket room
   */
  socket.join(roomId);

  socket.emit(Event.connection, {id : player.id, name : player.name, roomMaster : roomMaster});

  const updateRoom = () => {
    io.in(roomId).emit(Event.getRoom, room.toJson());
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
    console.log(room);
    updateRoom();
  });

  /**
   * Change Name Event
   */
  socket.on(Event.changeName, data => {
    if (player !== undefined) {
      player.name = data.name;
    }
    updateRoom();
  });

  /**
   * Start Game Event
   */
  socket.on(Event.startGame, () => {
    if (room.isRoomMaster(player)) {
      room.startGame();
    } 
    // Broadcast startGame Event to players
    io.in(roomId).emit(Event.startGame, room.gameState());
    shop();
  });

  /**
   * Get Self Event
   */
  socket.on(Event.getSelf, () => {
    socket.emit(Event.getSelf, player?.privateData());
  });

  socket.on(Event.bid, data => {
    room.bid(userId, data);
    socket.emit(Event.getSelf, player?.privateData());
  })

  socket.on(Event.pick, data => {
    player.play = data;
    socket.emit(Event.getSelf, player?.privateData());
  })

  const shop = () => {
    room.newShop();

    // Broadcast shopStart Event to players
    io.in(roomId).emit(Event.shopStart, room.getShop());

    // Set timeout for bidding phase
    setTimeout(() => {
      io.in(roomId).emit(Event.shopEnd, room.endShop());
      pick();
    }, Time.shop);
  };

  const pick = () => {
    room.startPick();
    io.in(roomId).emit(Event.pickStart, room.gameState());

    setTimeout(() => {
      io.in(roomId).emit(Event.pickEnd, room.endPick());
      shop();
    }, Time.pick);
  };
}