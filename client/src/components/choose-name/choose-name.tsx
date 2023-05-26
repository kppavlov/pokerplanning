import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// sessionStorage.setItem(
//   "persistedUser",
//   JSON.stringify({ name: inputsState.name.value })
// );
export const ChooseName = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameValue = inputRef?.current?.value;
    if (!nameValue?.trim()) {
      return setError(true);
    }

    sessionStorage.setItem(
      "persistedUser",
      JSON.stringify({ name: nameValue })
    );
    navigate(`../room/${location.state.room}`);
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
