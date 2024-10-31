import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocketConnect } from "./useSocketConnect.ts";

export const useJoinRoom = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const socket = useSocketConnect();

  useEffect(() => {
    const userName = JSON.parse(sessionStorage.getItem("persistedUser") ?? "{}")
      ?.name as string;

    if (!userName) {
      const currentValue = JSON.parse(
        sessionStorage.getItem("persistedUser") ?? "{}"
      );
      sessionStorage.setItem(
        "persistedUser",
        JSON.stringify({ ...currentValue, room: roomId })
      );
      return navigate("/choose-name");
    }

    socket?.emit("join-room", { roomId, userName });
  }, []);
};
