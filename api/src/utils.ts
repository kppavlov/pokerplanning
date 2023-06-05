import {
  JoinUsersToGroupProps,
  MainRoomsUtilsProps,
  RoomsType,
  UsersInTheRoomProps,
} from "./types";

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
      return;
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
  roomId,
  userName,
}: {
  userName: string;
  roomsMap: RoomsType;
  roomId: string;
}) => {
  if (checkIfRoomExists(roomId, roomsMap)) {
    const roomUsers = roomsMap.get(roomId);
    const updatedRoomUsers = roomUsers.map((user) => {
      if (user.isModerator && user.userName !== userName) {
        return { ...user, isModerator: false };
      }

      if (user.userName === userName) {
        return { ...user, isModerator: true };
      }
    });

    roomsMap.set(roomId, updatedRoomUsers);

    return updatedRoomUsers;
  }
};
