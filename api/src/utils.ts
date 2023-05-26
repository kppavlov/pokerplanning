import {
  JoinUsersToGroupProps,
  MainRoomsUtilsProps,
  RoomsType,
  UsersInTheRoomProps,
} from "./types";

export const checkIfRoomExists = (roomName: string, roomsMap: RoomsType) =>
  roomsMap.has(roomName);

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
      return false;
    }

    roomsMap.set(roomName, [
      ...socketsInTheRoom,
      { userName, id: socket.id, vote: null },
    ]);

    socket.join(roomName);
    return true;
  }

  roomsMap.set(roomName, [{ userName, id: socket.id, vote: null }]);

  socket.join(roomName);
};

export const removeUserFromRoom = ({
  roomsMap,
  socket,
}: MainRoomsUtilsProps) => {
  const rooms = socket.rooms.entries();
  for (const [key, value] of rooms) {
    if (!checkIfRoomExists(key, roomsMap)) {
      continue;
    }

    const roomUsers = roomsMap.get(key);

    const remainingUsers = roomUsers.filter((user) => user.id !== socket.id);

    if (!remainingUsers.length) {
      roomsMap.delete(key);
      return;
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
