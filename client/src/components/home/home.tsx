import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Socket from "../../socket";

export const Home = () => {
  const navigate = useNavigate();
  const socket = Socket.getSocket();
  const [inputsState, setInputsState] = useState({
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

  useEffect(() => {
    socket.connect();
  }, []);

  return (
    <form onSubmit={onCreateJoin}>
      Join Room
      <input
        value={inputsState.join.value}
        onChange={(e) => {
          return setInputsState((prev) => ({
            ...prev,
            join: {
              ...prev.join,
              value: e.target?.value || "",
            },
            create: {
              ...prev.create,
              value: "",
            },
          }));
        }}
      />
      Create Room
      <input
        value={inputsState.create.value}
        onChange={(e) => {
          return setInputsState((prev) => ({
            ...prev,
            create: {
              ...prev.create,
              value: e.target?.value || "",
            },
            join: {
              ...prev.join,
              value: "",
            },
          }));
        }}
      />
      <button type="submit">Join/Create</button>
    </form>
  );
};
