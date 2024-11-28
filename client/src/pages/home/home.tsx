import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// COMPONENTS
import { Input } from "../../components/input/input.tsx";
import { Button } from "../../components/button/button.tsx";

// HOOKS
import { useSocketConnect } from "../../hooks/useSocketConnect.ts";

// TYPES
import { CreateJoinInputState } from "./types.ts";

export const Home = () => {
  const navigate = useNavigate();
  const socket = useSocketConnect();
  const [inputsState, setInputsState] = useState<CreateJoinInputState>({
    join: {
      value: "",
      err: false,
    },
    create: {
      value: "",
      err: false,
    },
  });

  const onCreateJoin = (e: React.FormEvent) => {
    e.preventDefault();

    const joinValue = inputsState.join.value.trim();
    const createValue = inputsState.create.value.trim();

    if (!joinValue && !createValue) {
      setInputsState((prev) => ({
        ...prev,
        join: {
          ...prev.join,
          err: !joinValue,
        },
        create: {
          ...prev.create,
          err: !createValue,
        },
      }));
    }

    if (joinValue) {
      socket?.emit(
        "check-if-room-exists",
        { roomId: joinValue },
        (response: { status: "ok" | "not ok" }) => {
          if (response.status === "not ok") {
            sessionStorage.setItem(
              "persistedUser",
              JSON.stringify({ room: joinValue })
            );

            return navigate(`/choose-name`);
          }

          setInputsState((prevState) => ({
            ...prevState,
            join: {
              ...prevState.join,
              err: true,
            },
          }));
        }
      );

      return;
    }

    if (createValue) {
      socket?.emit(
        "check-if-room-exists",
        { roomId: createValue },
        (response: { status: "ok" | "not ok" }) => {
          if (response.status === "ok") {
            sessionStorage.setItem(
              "persistedUser",
              JSON.stringify({ room: inputsState.create.value })
            );

            return navigate(`/choose-name`);
          }

          setInputsState((prevState) => ({
            ...prevState,
            create: {
              ...prevState.create,
              err: true,
            },
          }));
        }
      );
    }
  };

  const handleJoinStateChange = (
    changeEvent: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputsState((prev) => ({
      ...prev,
      join: {
        ...prev.join,
        value: changeEvent.target?.value || "",
      },
      create: {
        ...prev.create,
        value: "",
      },
    }));
  };

  const handleCreateStateChange = (
    changeEvent: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputsState((prev) => ({
      ...prev,
      create: {
        ...prev.create,
        value: changeEvent.target?.value || "",
      },
      join: {
        ...prev.join,
        value: "",
      },
    }));
  };

  return (
    <form onSubmit={onCreateJoin}>
      Join Room
      <Input
        value={inputsState.join.value}
        error={inputsState.join.err}
        errorText="No such room in existence"
        onChange={handleJoinStateChange}
      />
      Create Room
      <Input
        value={inputsState.create.value}
        error={inputsState.create.err}
        errorText="Room name taken"
        onChange={handleCreateStateChange}
      />
      <Button type="submit">Join/Create</Button>
    </form>
  );
};
