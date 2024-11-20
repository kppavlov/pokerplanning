import { joinUserToRoom, removeUserFromRoom } from "./utils";
import { RoomsType } from "./types";
import { Socket } from "socket.io";

describe("joinUserToRoom", () => {
  let roomsMap: RoomsType;
  let socket: Socket;

  beforeEach(() => {
    roomsMap = new Map();
    socket = {
      id: "test-socket-id",
      join: jest.fn(),
      emit: jest.fn(),
    } as unknown as Socket;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should add a user to an existing room if no user with the same name exists", () => {
    const roomName = "test-room";
    const userName = "test-user";

    roomsMap.set(roomName, [
      { userName: "existing-user", id: "123", vote: null, isModerator: false },
    ]);

    const result = joinUserToRoom({ roomsMap, roomName, socket, userName });

    expect(result).toBe(true);
    expect(roomsMap.get(roomName)).toEqual([
      { userName: "existing-user", id: "123", vote: null, isModerator: false },
      { userName, id: socket.id, vote: null, isModerator: false },
    ]);
    expect(socket.join).toHaveBeenCalledWith(roomName);
    expect(socket.emit).not.toHaveBeenCalled();
  });

  it("should not add a user if a user with the same name already exists in the room", () => {
    const roomName = "test-room";
    const userName = "test-user";

    roomsMap.set(roomName, [
      { userName: "test-user", id: "123", vote: null, isModerator: false },
    ]);

    const result = joinUserToRoom({ roomsMap, roomName, socket, userName });

    expect(result).toBeUndefined();
    expect(socket.emit).toHaveBeenCalledWith("duplicate-user", {
      error: "User exists",
    });
    expect(roomsMap.get(roomName)).toEqual([
      { userName: "test-user", id: "123", vote: null, isModerator: false },
    ]);
    expect(socket.join).not.toHaveBeenCalled();
  });

  it("should create a new room and add the user as the moderator if the room does not exist", () => {
    const roomName = "new-room";
    const userName = "moderator-user";

    joinUserToRoom({ roomsMap, roomName, socket, userName });

    expect(roomsMap.get(roomName)).toEqual([
      { userName, id: socket.id, vote: null, isModerator: true },
    ]);
    expect(socket.join).toHaveBeenCalledWith(roomName);
    expect(socket.emit).not.toHaveBeenCalled();
  });
});

describe("removeUserFromRoom", () => {
  let roomsMap: RoomsType;
  let socket: any;

  beforeEach(() => {
    roomsMap = new Map();
    socket = {
      id: "socket-id",
      rooms: new Set(["room1", "room2"]),
    } as unknown as Socket;

    jest.clearAllMocks();
  });

  it("should remove the user from all rooms and delete empty rooms", () => {
    roomsMap.set("room1", [
      { id: "socket-id", userName: "user1", isModerator: false, vote: null },
    ]);
    roomsMap.set("room2", [
      { id: "socket-id", userName: "user1", isModerator: true, vote: null },
    ]);

    removeUserFromRoom({ roomsMap, socket });

    expect(roomsMap.get("room1")).toBeUndefined();
    expect(roomsMap.get("room2")).toBeUndefined();
  });

  it("should remove the user and set a new moderator if the moderator leaves", () => {
    roomsMap.set("room1", [
      { id: "socket-id", userName: "user1", isModerator: true, vote: null },
      { id: "other-id", userName: "user2", isModerator: false, vote: null },
    ]);

    removeUserFromRoom({ roomsMap, socket });

    expect(roomsMap.get("room1")).toEqual([
      { id: "other-id", userName: "user2", isModerator: true, vote: null },
    ]);
  });

  it("should remove the user without setting a new moderator if the moderator stays", () => {
    roomsMap.set("room1", [
      { id: "moderator-id", userName: "mod", isModerator: true, vote: null },
      { id: "socket-id", userName: "user1", isModerator: false, vote: null },
    ]);

    removeUserFromRoom({ roomsMap, socket });

    expect(roomsMap.get("room1")).toEqual([
      { id: "moderator-id", userName: "mod", isModerator: true, vote: null },
    ]);
  });

  it("should do nothing if the room does not exist", () => {
    roomsMap.set("room1", [
      { id: "other-id", userName: "user1", isModerator: false, vote: null },
    ]);

    removeUserFromRoom({ roomsMap, socket });

    expect(roomsMap.get("room1")).toEqual([
      { id: "other-id", userName: "user1", isModerator: true, vote: null },
    ]);
  });

  it("should skip rooms not in the socket", () => {
    roomsMap.set("room1", [
      { id: "socket-id", userName: "user1", isModerator: false, vote: null },
    ]);
    roomsMap.set("room3", [
      { id: "socket-id", userName: "user3", isModerator: true, vote: null },
    ]);

    removeUserFromRoom({ roomsMap, socket });

    expect(roomsMap.get("room1")).toBeUndefined();
    expect(roomsMap.get("room3")).toEqual([
      { id: "socket-id", userName: "user3", isModerator: true, vote: null },
    ]);
  });
});
