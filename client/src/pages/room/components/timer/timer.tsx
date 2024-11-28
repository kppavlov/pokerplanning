import { ChangeEvent, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

// COMPONENTS
import { Button } from "../../../../components/button/button.tsx";
import { Input } from "../../../../components/input/input.tsx";
import EditIcon from "../../../../components/icons/edit.tsx";

// HOOKS
import { useRoomState } from "../../../../store/room-ctx";
import { useSocketConnect } from "../../../../hooks/useSocketConnect.ts";

// UTILS
import { getCorrectTimeValue, getIsUserAModerator } from "../../utils.ts";

import "./timer.scss";

export const Timer = () => {
  const { roomId } = useParams();
  const { values, actions } = useRoomState();
  const { setTimer } = actions;
  const socket = useSocketConnect();
  const [activateInputs, setActivateInputs] = useState(false);
  const { timer, usersJoined } = values;
  const { seconds, minutes } = timer;
  const isNotTimerRunning = (minutes === 0 && seconds === 0) || timer.isActive;

  const isUserModerator = useMemo(
    () => getIsUserAModerator(usersJoined),
    [usersJoined]
  );
  const shouldAllowIncreaseDecrease = isUserModerator && !timer.isActive;

  const handleStartTimer = () => {
    if (isNotTimerRunning) {
      return;
    }
    setTimer((prevState) => ({
      ...prevState,
      isActive: true,
    }));
    setActivateInputs(false);
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

  const handleChangeMinutes = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;

    setTimer((prevValue) => ({
      ...prevValue,
      minutes: getCorrectTimeValue(val),
    }));
  };

  const handleChangeSeconds = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;

    setTimer((prevValue) => ({
      ...prevValue,
      seconds: getCorrectTimeValue(val),
    }));
  };

  const handleToggleInputs = () => {
    setActivateInputs((prevState) => !prevState);
  };

  return (
    <>
      <div tabIndex={0} className="timer-container">
        {isUserModerator && !timer.isActive && (
          <EditIcon onClick={handleToggleInputs} width={25} height={25} />
        )}
        <div>
          {shouldAllowIncreaseDecrease && (
            <p onClick={handleIncreaseMinutes}>Increase</p>
          )}

          {!activateInputs &&
            (minutes < 10 ? `0${minutes} min.` : `${minutes} min.`)}

          {activateInputs && (
            <Input
              type="number"
              value={minutes}
              onChange={handleChangeMinutes}
            />
          )}

          {shouldAllowIncreaseDecrease && (
            <p onClick={handleDecreaseMinutes}>Decrease</p>
          )}
        </div>
        :
        <div>
          {shouldAllowIncreaseDecrease && (
            <p onClick={handleIncreaseSeconds}>Increase</p>
          )}

          {!activateInputs &&
            (seconds < 10 ? `0${seconds} sec.` : `${seconds} sec.`)}

          {activateInputs && (
            <Input
              type="number"
              value={seconds}
              onChange={handleChangeSeconds}
            />
          )}

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
    </>
  );
};
