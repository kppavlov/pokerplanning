import { Socket } from "socket.io";

export type RoomsType = Map<
  string,
  { userName: string; id: string; vote: number | null; isModerator: boolean }[]
>;

export interface MainRoomsUtilsProps {
  roomsMap: RoomsType;
  socket: Socket;
}

export interface UsersInTheRoomProps {
  roomsMap: RoomsType;
  room: string;
  userName: string;
  vote: number | null;
}

export interface JoinUsersToGroupProps extends MainRoomsUtilsProps {
  roomName: string;
  userName: string;
}
