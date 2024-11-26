import { useMemo } from "react";
import { useParams } from "react-router-dom";

// COMPONENTS
import { Button } from "../../../../components/button/button.tsx";

// HOOKS
import { useRoomState } from "../../../../store/room-ctx";
import { useSocketConnect } from "../../../../hooks/useSocketConnect.ts";

// UTILS
import { getIsUserAModerator } from "../../utils.ts";

export const Timer = () => {
  const { roomId } = useParams();
  const { values, actions } = useRoomState();
  const { setTimer } = actions;
  const socket = useSocketConnect();
  const { timer, usersJoined } = values;
  const { seconds, minutes } = timer;
  const isNotTimerRunning = minutes === 0 && seconds === 0;

  const isUserModerator = useMemo(
    () => getIsUserAModerator(usersJoined),
    [usersJoined]
  );
  const shouldAllowIncreaseDecrease = isUserModerator && !timer.isActive;

  const handleStartTimer = () => {
    if (isNotTimerRunning) {
      return;
    }
    socket.emit("timer-start", { roomId, minutes, seconds });
  };

  const handleIncreaseMinutes = () => {
    setTimer((prev) => {
      if (prev.minutes === 60) {
        return {
          ...prev,
          minutes: 60,
        };
      }

      return {
        ...prev,
        minutes: prev.minutes + 1,
      };
    });
  };

  const handleDecreaseMinutes = () => {
    setTimer((prev) => {
      if (prev.minutes === 0) {
        return {
          ...prev,
          minutes: 0,
        };
      }

      return {
        ...prev,
        minutes: prev.minutes - 1,
      };
    });
  };

  const handleIncreaseSeconds = () => {
    setTimer((prevState) => {
      if (prevState.seconds === 60) {
        handleIncreaseMinutes();
        return {
          ...prevState,
          seconds: 60,
        };
      }

      return {
        ...prevState,
        seconds: prevState.seconds + 1,
      };
    });
  };

  const handleDecreaseSeconds = () => {
    setTimer((prevState) => {
      if (prevState.seconds === 0) {
        return {
          ...prevState,
          seconds: 0,
        };
      }

      return {
        ...prevState,
        seconds: prevState.seconds - 1,
      };
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <div>
          {shouldAllowIncreaseDecrease && (
            <p onClick={handleIncreaseMinutes}>Increase</p>
          )}

          {minutes < 10 ? `0${minutes} min.` : `${minutes} min.`}

          {shouldAllowIncreaseDecrease && (
            <p onClick={handleDecreaseMinutes}>Decrease</p>
          )}
        </div>
        :
        <div>
          {shouldAllowIncreaseDecrease && (
            <p onClick={handleIncreaseSeconds}>Increase</p>
          )}

          {seconds < 10 ? `0${seconds} sec.` : `${seconds} sec.`}

          {shouldAllowIncreaseDecrease && (
            <p onClick={handleDecreaseSeconds}>Decrease</p>
          )}
        </div>
      </div>

      {shouldAllowIncreaseDecrease && (
        <Button disabled={isNotTimerRunning} onClick={handleStartTimer}>
          Start
        </Button>
      )}
    </div>
  );
};
