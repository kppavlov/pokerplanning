import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocketConnect } from "../../hooks/useSocketConnect.ts";

// COMPONENTS
import { Input } from "../../components/input/input.tsx";
import { Button } from "../../components/button/button.tsx";

export const ChooseName = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const socket = useSocketConnect();

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

  return (
    <form onSubmit={onSubmit}>
      Enter your name
      <Input
        ref={inputRef}
        error={error}
        errorText="Name already taken"
        onChange={() => setError(false)}
      />
      <Button type="submit">Join!</Button>
    </form>
  );
};
