import { Room } from "../types";
import { Request, Response } from 'express';
import { makeid } from "./helper";

const express = require('express'); 
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

if (!process.env.NODE_ENV) 
  process.env.NODE_ENV = 'development';

if (process.env.NODE_ENV === 'development') {
  console.log("CORS enabled");
  app.use(cors());
}

var rooms : { [key : string] : Room } = {}; 

const socket = require('./socket');
socket(server, rooms);
app.use(express.json());

app.post('/room', (req : Request , res : Response) => {
  let roomId = makeid(6);
  rooms[roomId] = new Room(roomId);
  res.send({roomId : "23"});
});

app.get('/room/:id', (req : Request , res : Response) => {
  if (req.params.id in rooms) {
    res.send(rooms[req.params.id]);
  } else {
    res.status(404).send('Not found');
  }
});

server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
