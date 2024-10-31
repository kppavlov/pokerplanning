import { RoomsType } from "./types";
import {
  checkIfNameIsTaken,
  checkIfRoomExists,
  joinUserToRoom,
  removeUserFromRoom,
  resetUserVote,
  updateModeratorState,
  updateUserVote,
} from "./utils";

import express from "express";
const app = express();
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://poker.threesixtybg.com"],
    methods: ["GET", "POST"],
  },
});

const roomUsersMap: RoomsType = new Map();

io.on("connection", async (socket) => {
  socket.on("join-room", ({ roomId, userName }) => {
    const isNameTaken = checkIfNameIsTaken(roomId, roomUsersMap, userName);

    if (!isNameTaken) {
      joinUserToRoom({
        roomsMap: roomUsersMap,
        roomName: roomId,
        socket,
        userName,
      });
    }
  });

  socket.on("check-if-name-taken", ({ roomId, userName }, callback) => {
    const isNameTaken = checkIfNameIsTaken(roomId, roomUsersMap, userName);

    callback({
      status: isNameTaken ? "not ok" : "ok",
    });
  });

  socket.on("check-if-room-exists", ({ roomId }, callback) => {
    const doesExist = checkIfRoomExists(roomId, roomUsersMap);

    callback({
      status: doesExist ? "not ok" : "ok",
    });
  });

  socket.on("disconnecting", () => {
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

  socket.on("timer-start", ({ roomId, seconds, minutes }) => {
    io.to(roomId).emit("timer-start", { seconds, minutes });
  });

  socket.on("timer-stop", (roomId) => {
    io.to(roomId).emit("timer-stop");
  });

  socket.on("set-new-moderator", ({ userName, roomId }) => {
    const updatedUsers = updateModeratorState({
      userName,
      roomsMap: roomUsersMap,
      roomName: roomId,
    });

    if (updatedUsers) {
      io.to(roomId).emit("users-table-moderate-updated", updatedUsers);
    }
  });
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
