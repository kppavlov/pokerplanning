import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ChooseName = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameValue = inputRef?.current?.value;
    if (!nameValue?.trim()) {
      return setError(true);
    }

    const currentPersistedValue: { name: string; room: string } = JSON.parse(
      sessionStorage.getItem("persistedUser") ?? '{ "name": "", "room": ""}'
    );

    sessionStorage.setItem(
      "persistedUser",
      JSON.stringify({ ...currentPersistedValue, name: nameValue })
    );
    navigate(`../room/${currentPersistedValue?.room}`);
  };

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
