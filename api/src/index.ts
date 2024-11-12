import { RoomsType } from "./types";
import {
  removeUserFromRoom,
  resetUserVote,
  updateModeratorState,
  updateUserVote,
} from "./utils";
import { config } from "dotenv";

config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

import { socketListeners } from "./constants";

import express from "express";
const app = express();
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";

const io = new Server(server, {
  cors: {
    origin: [process.env.CORS_DOMAIN],
    methods: ["GET", "POST"],
  },
});

const roomUsersMap: RoomsType = new Map();

io.on("connection", async (socket) => {
  for (const key in socketListeners) {
    socket.on(key, socketListeners[key](roomUsersMap, socket, io));
  }
});

io.of("/").adapter.on("create-room", (room) => {
  console.log("room has been created", room);
});

io.of("/").adapter.on("join-room", (room, id) => {
  console.log("joining room", room, id, roomUsersMap.get(room));
  io.to(room).emit("user-joined", roomUsersMap.get(room));
});

io.of("/").adapter.on("leave-room", (room, id) => {
  console.log("leave room", room, id);
  io.to(room).emit("user-leave", roomUsersMap.get(room));
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
