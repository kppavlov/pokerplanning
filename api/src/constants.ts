import {
  checkIfNameIsTaken,
  checkIfRoomExists,
  newInterval,
  removeUserFromRoom,
  resetUserVote,
  timersMap,
  updateModeratorState,
  updateUserVote,
} from "./utils";
import { joinRoomHandler } from "./socket-listeners-handlers";
import { EventListenerCallback } from "./types";

export const socketListeners: Record<string, EventListenerCallback> = {
  "join-room": joinRoomHandler,
  "check-if-name-taken":
    (roomUsersMap) =>
    (
      { roomId, userName }: any,
      callback: (arg0: { status: string }) => void
    ) => {
      const isNameTaken = checkIfNameIsTaken(roomId, roomUsersMap, userName);

      callback({
        status: isNameTaken ? "not ok" : "ok",
      });
    },
  "check-if-room-exists":
    (roomUsersMap) =>
    ({ roomId }, callback) => {
      const doesExist = checkIfRoomExists(roomId, roomUsersMap);

      callback({
        status: doesExist ? "not ok" : "ok",
      });
    },
  "vote-chosen":
    (roomUsersMap, _, io) =>
    ({ cardId, roomId, userName }) => {
      const users = updateUserVote({
        roomsMap: roomUsersMap,
        room: roomId,
        userName,
        vote: cardId,
      });

      io.to(roomId).emit("vote-chosen", users);
    },
  "vote-reset":
    (roomUsersMap, _, io) =>
    ({ roomId }) => {
      const users = resetUserVote({
        roomsMap: roomUsersMap,
        room: roomId,
      });

      io.to(roomId).emit("vote-reset", users);
    },
  "reveal-result": (__, _, io) => (roomId) => {
    io.to(roomId).emit("reveal-result");
  },
  "timer-start":
    (__, _, io) =>
    ({ roomId, seconds, minutes }) => {
      if (timersMap.get(roomId)) {
        return;
      }

      newInterval({ roomId, seconds, minutes, io });
    },
  "set-new-moderator":
    (roomUsersMap, _, io) =>
    ({ userName, roomId }) => {
      const updatedUsers = updateModeratorState({
        userName,
        roomsMap: roomUsersMap,
        roomName: roomId,
      });

      if (updatedUsers) {
        io.to(roomId).emit("users-table-moderate-updated", updatedUsers);
      }
    },
  disconnecting: (roomUsersMap, socket) => () => {
    removeUserFromRoom({ socket, roomsMap: roomUsersMap });
  },
};
