import { RoomsType } from "./types";
import {
  joinUserToRoom,
  removeUserFromRoom,
  resetUserVote,
  updateUserVote,
} from "./utils";

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://poker.threesixtybg.com"],
    methods: ["GET", "POST"],
  },
});

const roomUsersMap: RoomsType = new Map();

io.on("connection", async (socket) => {
  console.log("someone connected");
  const roomName = socket.handshake.query.room as string;
  const userName = socket.handshake.query.name as string;
  console.log("==================");
  console.log(roomUsersMap, roomName, userName);
  console.log("==================");
  joinUserToRoom({ roomsMap: roomUsersMap, roomName, socket, userName });

  socket.on("disconnecting", () => {
    console.log("DIsconnecting");
    removeUserFromRoom({ socket, roomsMap: roomUsersMap });
  });

  socket.on("vote-chosen", ({ cardId, roomId, userName }) => {
    const users = updateUserVote({
      roomsMap: roomUsersMap,
      room: roomId,
      userName,
      vote: cardId,
    });

    io.to(roomId).emit("vote-chosen", users);
  });

  socket.on("vote-reset", ({ roomId }) => {
    const users = resetUserVote({
      roomsMap: roomUsersMap,
      room: roomId,
    });

    io.to(roomId).emit("vote-reset", users);
  });

  socket.on("reveal-result", (roomId) => {
    io.to(roomId).emit("reveal-result");
  });
});

io.of("/").adapter.on("create-room", (room) => {
  console.log("room has been created", room);
});

io.of("/").adapter.on("join-room", (room, id) => {
  console.log("joining room", room, id);
  io.to(room).emit("user-joined", roomUsersMap.get(room));
});

io.of("/").adapter.on("leave-room", (room, id) => {
  console.log("leave room", room, id);
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
