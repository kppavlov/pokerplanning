import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const [inputsState, setInputsState] = useState({
    join: {
      value: "",
      err: false,
    },
  });

  const onCreateJoin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputsState.join.value.trim()) {
      return setInputsState((prev) => ({
        ...prev,
        join: {
          ...prev.join,
          err: !inputsState.join.value.trim(),
        },
      }));
    }

    sessionStorage.setItem('persistedUser', JSON.stringify({ room: inputsState.join.value }))
    navigate(`/choose-name`);
  };

  return (
    <form onSubmit={onCreateJoin}>
      Join/Create Room
      <input
        value={inputsState.join.value}
        onChange={(e) => {
          return setInputsState((prev) => ({
            ...prev,
            join: {
              ...prev.join,
              value: e.target?.value || "",
            },
          }));
        }}
      />
      <button type="submit">Join/Create</button>
    </form>
  );
};
