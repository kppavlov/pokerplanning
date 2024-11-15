import { joinRoomHandler } from "./socket-listeners-handlers";

import { RoomsType } from "./types";
import { Socket } from "socket.io";

const checkIfNameIsTakenMock = jest.fn();
const joinUserToRoomMock = jest.fn();

jest.mock("./utils", () => ({
  checkIfNameIsTaken: (...args) => checkIfNameIsTakenMock(...args),
  joinUserToRoom: (...args) => joinUserToRoomMock(...args),
}));

describe("joinRoomHandler", () => {
  let roomUsersMap: RoomsType;
  let socket = {
    emit: jest.fn(),
    join: jest.fn(),
  } as unknown as Socket;

  beforeEach(() => {
    // Mock dependencies

    roomUsersMap = new Map();
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore the original methods
  });

  it("should call `joinUserToRoom` if the name is not taken", () => {
    const roomId = "test-room";
    const userName = "test-user";

    // Set up stubs
    checkIfNameIsTakenMock.mockReturnValue(false);

    joinRoomHandler(roomUsersMap, socket)({ roomId, userName });

    expect(checkIfNameIsTakenMock).toHaveBeenCalledWith(
      roomId,
      roomUsersMap,
      userName
    );

    expect(joinUserToRoomMock).toHaveBeenCalledWith({
      roomsMap: roomUsersMap,
      roomName: roomId,
      socket,
      userName,
    });
  });

  // it("should not call `joinUserToRoom` if the name is taken", () => {
  //   const roomId = "test-room";
  //   const userName = "test-user";
  //
  //   // Set up stubs
  //   checkIfNameIsTakenStub.returns(true);
  //
  //   const handler = joinRoomHandler(roomUsersMap, socket);
  //   handler({ roomId, userName });
  //
  //   expect(
  //     checkIfNameIsTakenStub.calledOnceWithExactly(
  //       roomId,
  //       roomUsersMap,
  //       userName
  //     )
  //   ).to.be.true;
  //   expect(joinUserToRoomStub.called).to.be.false;
  // });
});
