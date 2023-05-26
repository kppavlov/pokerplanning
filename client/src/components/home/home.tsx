import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
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

    if (!inputsState.create.value.trim() && !inputsState.join.value.trim()) {
      return setInputsState((prev) => ({
        ...prev,
        create: {
          ...prev.create,
          err: !inputsState.create.value.trim(),
        },
        join: {
          ...prev.join,
          err: !inputsState.join.value.trim(),
        },
      }));
    }

    navigate(`/choose-name`, {
      state: { room: inputsState.join.value || inputsState.create.value },
    });
  };

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
        onChange={(e) =>
          setInputsState((prev) => ({
            ...prev,
            create: {
              ...prev.create,
              value: e.target?.value || "",
            },
            join: {
              ...prev.join,
              value: "",
            },
          }))
        }
      />
      <button type="submit">Join/Create</button>
    </form>
  );
};
