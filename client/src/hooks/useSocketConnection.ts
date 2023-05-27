import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
let socket: Socket | null = null;

interface UserProps {
  userName: string;
  id: string;
  vote: number | null;
}

console.log("============================================================");
console.log(import.meta.env.VITE_APP_HOST);
console.log("============================================================");

export const useSocketConnection = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [usersJoined, setUsersJoined] = useState<UserProps[]>([]);

  useEffect(() => {
    const name = JSON.parse(
      sessionStorage.getItem("persistedUser") ?? ""
    )?.name;

    if (!name) {
      navigate("/choose-name", {
        state: { room: roomId },
      });
      return;
    }

    socket = io(import.meta.env.VITE_APP_HOST, {
      reconnectionDelayMax: 10000,
      query: {
        room: roomId,
        name,
      },
    });

    socket.on(
      "user-joined",
      (users: { userName: string; id: string; vote: null }[]) => {
        if (!users) {
          return;
        }
        setUsersJoined(users);
      }
    );

    socket.on(
      "vote-chosen",
      (users: { userName: string; id: string; vote: null }[]) => {
        if (!users) {
          return;
        }
        setUsersJoined(users);
      }
    );

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [roomId]);

  return {
    usersJoined,
    socket,
    roomId,
  };
};
