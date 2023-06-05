import { io, Socket as SocketType } from "socket.io-client";

let instance: Socket;
let socket: SocketType;

class Socket {
  constructor() {
    if (instance) {
      throw new Error("New instance cannot be created!!");
    }

    instance = this;
  }

  getInstance() {
    if (!instance) {
      throw new Error("New instance must be created first");
    }

    instance = this;
  }

  createSocket() {
    socket = io(import.meta.env.VITE_APP_HOST, {
      reconnectionDelayMax: 10000,
      autoConnect: false,
    });

    return instance;
  }

  disconnect() {
    socket.disconnect();
  }

  getSocket() {
    return socket;
  }
}

let SocketInstance = Object.freeze(new Socket());

export default SocketInstance;
