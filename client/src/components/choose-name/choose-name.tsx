import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Socket from "../../socket";

export const ChooseName = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const socket = Socket.getSocket();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameValue = inputRef?.current?.value;

    if (!nameValue?.trim()) {
      return setError(true);
    }

    const currentPersistedValue: { name: string; room: string } = JSON.parse(
      sessionStorage.getItem("persistedUser") ?? '{ "name": "", "room": ""}'
    );

    socket?.emit(
      "check-if-name-taken",
      { roomId: currentPersistedValue?.room, userName: nameValue },
      (res: { status: "ok" | "not ok" }) => {
        if (res.status === "ok") {
          sessionStorage.setItem(
            "persistedUser",
            JSON.stringify({ ...currentPersistedValue, name: nameValue })
          );

          return navigate(`../room/${currentPersistedValue?.room}`);
        }

        setError(true);
      }
    );
  };

  useEffect(() => {
    if (socket && !socket.connected) {
      socket.connect();
    }
  }, [socket]);

  return (
    <form onSubmit={onSubmit}>
      Create Name
      <input
        ref={inputRef}
        className={error ? "input-error" : ""}
        onChange={() => setError(false)}
      />
      <button type="submit">Create</button>
    </form>
  );
};
