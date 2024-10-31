import { useParams } from "react-router-dom";

// UTILS
import { getIsUserAModerator } from "../../utils.ts";

// COMPONENTS
import { MakeModeratorButton } from "../moderator-button.tsx";
import { ResultContainer } from "../result-container.tsx";

// HOOKS
import { useRoomState } from "../../../../store/room-ctx";
import { useSocketConnect } from "../../../../hooks/useSocketConnect.ts";

import "./users-table.scss";

export const UsersTable = () => {
  const socket = useSocketConnect();
  const { roomId } = useParams();
  const { values } = useRoomState();
  const { usersJoined, shouldReveal } = values;

  const handleSetNewModerator = (userName: string) => {
    socket.emit("set-new-moderator", { userName, roomId });
  };

  return (
    <div className="user-list-avg-container">
      <div className="user-list-container">
        <ul>
          <li>User name</li>
          <li>Has voted</li>
          <li>Vote</li>
          {getIsUserAModerator(usersJoined) && <li>Mod contorl</li>}
        </ul>

        {usersJoined.map((user) => (
          <ul key={user.userName}>
            <li>{user.userName}</li>

            <li>{user.vote ? "✔" : "???"}</li>

            <li>
              {shouldReveal ? (user.vote ? user.vote : "Did not vote") : "???"}
            </li>

            {getIsUserAModerator(usersJoined) && (
              <li>
                <MakeModeratorButton
                  currentUser={user}
                  usersJoined={usersJoined}
                  onClick={handleSetNewModerator}
                />
              </li>
            )}
          </ul>
        ))}
      </div>

      <ResultContainer />
    </div>
  );
};
