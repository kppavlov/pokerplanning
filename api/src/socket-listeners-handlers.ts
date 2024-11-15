import { checkIfNameIsTaken, joinUserToRoom } from "./utils";
import { EventListenerCallback } from "./types";

export const joinRoomHandler: EventListenerCallback =
  (roomUsersMap, socket) =>
  ({ roomId, userName }) => {
    const isNameTaken = checkIfNameIsTaken(roomId, roomUsersMap, userName);

    if (!isNameTaken) {
      joinUserToRoom({
        roomsMap: roomUsersMap,
        roomName: roomId,
        socket,
        userName,
      });
    }
  };
