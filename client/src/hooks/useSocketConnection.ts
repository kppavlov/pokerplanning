import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
let socket: Socket | null = null;

interface UserProps {
  userName: string;
  id: string;
  vote: number | null;
}

interface HookProps {
  onReset: () => void;
}

export const useSocketConnection = ({ onReset }: HookProps) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [usersJoined, setUsersJoined] = useState<UserProps[]>([]);

  useEffect(() => {
    if (socket) {
      return;
    }

    const parsedPersistedUser = JSON.parse(
      sessionStorage.getItem("persistedUser") ?? "{}"
    );

    if (!parsedPersistedUser.name) {
      sessionStorage.setItem(
        "persistedUser",
        JSON.stringify({ ...parsedPersistedUser, room: roomId })
      );

      navigate("/choose-name");
      return;
    }

    socket = io(import.meta.env.VITE_APP_HOST, {
      reconnectionDelayMax: 10000,
      query: {
        room: roomId,
        name: parsedPersistedUser.name,
      },
    });

    socket.on("duplicate-user", ({ error }) => {
      if (error) {
        navigate("/choose-name");
      }
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

    socket.on(
      "vote-reset",
      (users: { userName: string; id: string; vote: null }[]) => {
        if (!users) {
          return;
        }

        setUsersJoined(users);
        onReset();
      }
    );

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }, [roomId]);

  return {
    usersJoined,
    socket,
    roomId,
  };
};
