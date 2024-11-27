import { useParams } from "react-router-dom";
import { useMemo } from "react";

// UTILS
import { getIsUserAModerator } from "../../utils.ts";

// HOOKS
import { useSocketConnect } from "../../../../hooks/useSocketConnect.ts";
import { useRoomState } from "../../../../store/room-ctx";

// COMPONENTS
import { Button } from "../../../../components/button/button.tsx";
import { Timer } from "../timer/timer.tsx";

import "./action-buttons.scss";

export const ActionButtons = () => {
  const { roomId } = useParams();
  const { actions, values } = useRoomState();
  const { setDisableSubmitButton } = actions;
  const { shouldReveal, usersJoined, selectedCard, disableSubmitButton } =
    values;
  const socket = useSocketConnect();

  const isCurrentUserModerator = useMemo(
    () => getIsUserAModerator(usersJoined),
    [usersJoined]
  );

  const handleSubmitVote = () => {
    if (selectedCard === null) {
      return;
    }

    const userName = JSON.parse(sessionStorage.getItem("persistedUser") ?? "{}")
      ?.name as string;

    socket?.emit("vote-chosen", {
      roomId,
      cardId: selectedCard,
      userName,
    });

    setDisableSubmitButton(true);
  };

  const handleResetVote = () => {
    socket?.emit("vote-reset", { roomId });
  };

  return (
    <div className="action-buttons-wrapper">
      <Timer />

      <div className="buttons-holder">
        {isCurrentUserModerator && (
          <Button
            disabled={!isCurrentUserModerator}
            onClick={() => {
              socket?.emit("reveal-result", roomId)
              socket?.emit("timer-stop", roomId)
            }}
          >
            Show results
          </Button>
        )}

        <Button
          disabled={selectedCard === null || disableSubmitButton}
          onClick={handleSubmitVote}
        >
          Submit vote
        </Button>

        {isCurrentUserModerator && (
          <Button disabled={!shouldReveal} onClick={handleResetVote}>
            Reset estimation
          </Button>
        )}
      </div>
    </div>
  );
};
