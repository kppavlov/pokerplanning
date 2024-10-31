import { getIsUserAModerator } from "../utils.ts";
import { Button } from "../../../components/button/button.tsx";

export const MakeModeratorButton = ({
  currentUser,
  usersJoined,
  onClick,
}: {
  usersJoined: Users;
  currentUser: UserProps;
  onClick: (userName: string) => void;
}) => {
  const moderatorUser = getIsUserAModerator(usersJoined);

  return currentUser.userName !== moderatorUser?.userName ? (
    <Button
      style={{
        padding: "0 3px",
        fontSize: "12px",
      }}
      onClick={() => onClick(currentUser.userName)}
    >
      Make moderator
    </Button>
  ) : null;
};
