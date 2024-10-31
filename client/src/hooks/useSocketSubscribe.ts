import { useEffect } from "react";
import { useSocketConnect } from "./useSocketConnect.ts";
import { useRoomState } from "../store/room-ctx";
import { useNavigate } from "react-router-dom";

export const useSocketSubscribe = () => {
  const navigate = useNavigate();
  const socket = useSocketConnect();
  const { actions } = useRoomState();
  const {
    setUsersJoined,
    setShouldReveal,
    setSelectedCard,
    setDisableSubmitButton,
    setTimer,
  } = actions;

  const handleOnReset = () => {
    setShouldReveal(false);
    setSelectedCard(null);
  };

  useEffect(() => {
    function handleVoteReset(users: Users) {
      if (!users) {
        return;
      }

      setUsersJoined(users);
      setDisableSubmitButton(false);

      handleOnReset();
    }

    function handleSimpleUsersSet(users: Users) {
      if (!users) {
        return;
      }

      setUsersJoined(users);
    }

    function handleRevealResult() {
      setShouldReveal(true);
      setDisableSubmitButton(true);
    }

    function handleDuplicateUser(error: { error: string }) {
      if (error) {
        navigate("/choose-name");
      }
    }

    function handleConnectionError(err: Error) {
      console.error(`connect_error due to ${err.message}`);
    }

    function handleTimerStart({
      seconds,
      minutes,
    }: {
      seconds: number;
      minutes: number;
    }) {
      setTimer((prevState) => ({
        ...prevState,
        seconds,
        minutes,
        isActive: true,
      }));
    }

    function handleTimerStop() {
      setTimer((prevState) => ({
        ...prevState,
        isActive: false,
      }));
    }

    socket.on("vote-chosen", handleSimpleUsersSet);

    socket.on("vote-reset", handleVoteReset);

    socket.on("user-joined", handleSimpleUsersSet);

    socket.on("users-table-moderate-updated", handleSimpleUsersSet);

    socket.on("reveal-result", handleRevealResult);

    socket.on("duplicate-user", handleDuplicateUser);

    socket.on("connect_error", handleConnectionError);

    socket.on("user-leave", handleSimpleUsersSet);

    socket.on("timer-start", handleTimerStart);

    socket.on("timer-stop", handleTimerStop);

    return () => {
      socket.off("vote-chosen", handleSimpleUsersSet);

      socket.off("vote-reset", handleVoteReset);

      socket.off("user-joined", handleSimpleUsersSet);

      socket.off("users-table-moderate-updated", handleSimpleUsersSet);

      socket.off("reveal-result", handleRevealResult);

      socket.off("duplicate-user", handleDuplicateUser);

      socket.off("connect_error", handleConnectionError);
    };
  }, []);
};
