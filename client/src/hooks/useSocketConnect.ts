import {useEffect} from "react";
import Socket from "../socket.ts";

export const useSocketConnect = () => {
  const socket = Socket.getSocket();

  useEffect(() => {
    !socket.connected && socket.connect();
  }, []);

  return socket;
}