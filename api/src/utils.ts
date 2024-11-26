import {
  JoinUsersToGroupProps,
  MainRoomsUtilsProps,
  RoomsType,
  UsersInTheRoomProps,
} from "./types";
import { Server } from "socket.io";

export const checkIfRoomExists = (roomName: string, roomsMap: RoomsType) =>
  roomsMap.has(roomName);

export const checkIfNameIsTaken = (
  roomName: string,
  roomsMap: RoomsType,
  userName: string
) =>
  roomsMap.get(roomName)?.some((user) => user.userName === userName) ?? false;

export const joinUserToRoom = ({
  roomsMap,
  roomName,
  socket,
  userName,
}: JoinUsersToGroupProps) => {
  if (checkIfRoomExists(roomName, roomsMap)) {
    const socketsInTheRoom = roomsMap.get(roomName);

    const hasUserWithSameName = socketsInTheRoom.some(
      (user) => user.userName === userName
    );

    if (hasUserWithSameName) {
      socket.emit("duplicate-user", { error: "User exists" });
      return;
    }

    roomsMap.set(roomName, [
      ...socketsInTheRoom,
      { userName, id: socket.id, vote: null, isModerator: false },
    ]);

    socket.join(roomName);
    return true;
  }

  roomsMap.set(roomName, [
    { userName, id: socket.id, vote: null, isModerator: true },
  ]);

  socket.join(roomName);
};

export const removeUserFromRoom = ({
  roomsMap,
  socket,
}: MainRoomsUtilsProps) => {
  const rooms = socket.rooms.entries();

  for (const [key, _] of rooms) {
    if (!checkIfRoomExists(key, roomsMap)) {
      continue;
    }

    const roomUsers = roomsMap.get(key);

    const remainingUsers = roomUsers.filter((user) => user.id !== socket.id);

    if (!remainingUsers.length) {
      roomsMap.delete(key);
      continue;
    }

    const didModeratorLeave = !remainingUsers.some((user) => user.isModerator);

    if (didModeratorLeave) {
      // set the first in the list as moderator if the mod left the est
      remainingUsers[0].isModerator = true;
    }

    roomsMap.set(key, remainingUsers);
  }
};

export const updateUserVote = ({
  roomsMap,
  room,
  vote,
  userName,
}: UsersInTheRoomProps) => {
  const users = roomsMap.get(room);
  const usersWithUpdatedVote = users.map((user) => {
    if (user.userName === userName) {
      return { ...user, vote };
    }

    return user;
  });

  roomsMap.set(room, usersWithUpdatedVote);

  return usersWithUpdatedVote;
};

export const resetUserVote = ({
  roomsMap,
  room,
}: {
  roomsMap: RoomsType;
  room: string;
}) => {
  const users = roomsMap.get(room);
  const usersWithUpdatedVote = users.map((user) => {
    return { ...user, vote: null };
  });
  roomsMap.set(room, usersWithUpdatedVote);

  return usersWithUpdatedVote;
};

export const updateModeratorState = ({
  roomsMap,
  roomName,
  userName,
}: {
  userName: string;
  roomsMap: RoomsType;
  roomName: string;
}) => {
  if (checkIfRoomExists(roomName, roomsMap)) {
    const roomUsers = roomsMap.get(roomName);
    const updatedRoomUsers = roomUsers.map((user) => {
      if (user.isModerator && user.userName !== userName) {
        return { ...user, isModerator: false };
      }

      if (user.userName === userName) {
        return { ...user, isModerator: true };
      }

      return user;
    });

    roomsMap.set(roomName, updatedRoomUsers);

    return updatedRoomUsers;
  }
};

export const timersMap = new Map();

export const newInterval = ({
  io,
  roomId,
  seconds,
  minutes,
}: {
  io: Server;
  roomId: string;
  seconds: number;
  minutes: number;
}) => {
  let newSec = seconds;
  let newMin = minutes;

  const interval = setInterval(() => {
    if (newSec !== 0) {
      --newSec;
    }

    if (newMin === 0 && newSec === 0) {
      io.to(roomId).emit("timer-tick", { seconds: newSec, minutes: newMin });
      io.to(roomId).emit("timer-stop");
      io.to(roomId).emit("reveal-result");

      clearInterval(timersMap.get(roomId));
      timersMap.delete(roomId);
      return;
    }

    if (newSec === 0) {
      newSec = 59;
      newMin = newMin === 0 ? 0 : --newMin;

      io.to(roomId).emit("timer-tick", { seconds: newSec, minutes: newMin });

      return;
    }
    io.to(roomId).emit("timer-tick", { seconds: newSec, minutes: newMin });
  }, 1000);

  timersMap.set(roomId, interval);
};
