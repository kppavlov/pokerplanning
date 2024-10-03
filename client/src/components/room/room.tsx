import { Card } from "../card/card";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Socket from "../../socket";
import { Share } from "../icons/share";

interface UserProps {
  userName: string;
  id: string;
  vote: number | null;
  isModerator: boolean;
}

type Users = UserProps[];

const cardsSet = [
  { number: 0 },
  { number: 1 },
  { number: 2 },
  { number: 3 },
  { number: 5 },
  { number: 8 },
  { number: 13 },
  { number: 21 },
  { number: 40 },
  { number: 100 },
];

const getIsUserAModerator = (usersJoined: Users) => {
  const userName = JSON.parse(sessionStorage.getItem("persistedUser") ?? "{}")
    ?.name as string;

  return usersJoined?.find(
    (user) => user.userName === userName && user.isModerator
  );
};

const MakeModeratorButton = ({
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
    <button
      style={{
        padding: "0 3px",
        fontSize: "12px",
      }}
      onClick={() => onClick(currentUser.userName)}
    >
      Make moderator
    </button>
  ) : null;
};

export const Room = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [shouldReveal, setShouldReveal] = useState(false);
  const [usersJoined, setUsersJoined] = useState<Users>([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const socket = Socket.getSocket();

  const handleOnreset = () => {
    setShouldReveal(false);
    setSelectedCard(null);
  };

  const handleCardClick = (cardId: number) => {
    setSelectedCard(cardId);
  };

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
  };

  const handleResetVote = () => {
    socket?.emit("vote-reset", { roomId });
  };

  const handleCopyUrl = async () => {
    await window.navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
  };

  const handleSetNewModerator = (userName: string) => {
    socket.emit("set-new-moderator", { userName, roomId });
  };

  useEffect(() => {
    socket.connect();

    function handleVoteReset(users: Users) {
      if (!users) {
        return;
      }

      setUsersJoined(users);

      handleOnreset?.();
    }

    function handleSimpleUsersSet(users: Users) {
      if (!users) {
        return;
      }

      setUsersJoined(users);
    }

    function handleRevealResult() {
      setShouldReveal(true);
    }

    function handleDuplicateUser(error: { error: string }) {
      if (error) {
        navigate("/choose-name");
      }
    }

    function handleConnectionError(err: Error) {
      console.error(`connect_error due to ${err.message}`);
    }

    socket.on("vote-chosen", handleSimpleUsersSet);

    socket.on("vote-reset", handleVoteReset);

    socket.on("user-joined", handleSimpleUsersSet);

    socket.on("users-moderate-updated", handleSimpleUsersSet);

    socket.on("reveal-result", handleRevealResult);

    socket.on("duplicate-user", handleDuplicateUser);

    socket.on("connect_error", handleConnectionError);

    socket.on("user-leave", handleSimpleUsersSet);

    return () => {
      socket.off("vote-chosen", handleSimpleUsersSet);

      socket.off("vote-reset", handleVoteReset);

      socket.off("user-joined", handleSimpleUsersSet);

      socket.off("users-moderate-updated", handleSimpleUsersSet);

      socket.off("reveal-result", handleRevealResult);

      socket.off("duplicate-user", handleDuplicateUser);

      socket.off("connect_error", handleConnectionError);
    };
  }, []);

  useEffect(() => {
    const userName = JSON.parse(sessionStorage.getItem("persistedUser") ?? "{}")
      ?.name as string;

    if (!userName) {
      const currentValue = JSON.parse(
        sessionStorage.getItem("persistedUser") ?? "{}"
      );
      sessionStorage.setItem(
        "persistedUser",
        JSON.stringify({ ...currentValue, room: roomId })
      );
      return navigate("/choose-name");
    }

    socket?.emit("join-room", { roomId, userName });
  }, []);

  return (
    <>
      <h3
        onClick={handleCopyUrl}
        className={`copy-link-header ${
          linkCopied ? "copy-link-header-clicked" : ""
        }`}
      >
        Copy link{" "}
        <Share
          width={16}
          height={16}
          viewBox="0 0 30 30"
          fill={linkCopied ? "limegreen" : "#333d51"}
        />
      </h3>
      <div className="card-container">
        {cardsSet.map((option) => (
          <Card
            key={option.number}
            number={option.number}
            onClick={handleCardClick}
            isSelected={selectedCard === option.number}
          />
        ))}
      </div>

      <div className="action-buttons-wrapper">
        <button
          disabled={!getIsUserAModerator(usersJoined)}
          onClick={() => socket?.emit("reveal-result", roomId)}
        >
          Show results
        </button>

        <button disabled={!selectedCard} onClick={handleSubmitVote}>
          Submit vote
        </button>

        <button disabled={!shouldReveal} onClick={handleResetVote}>
          Reset estimation
        </button>
      </div>

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
                {shouldReveal
                  ? user.vote
                    ? user.vote
                    : "Did not vote"
                  : "???"}
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

        <div className="average-container">
          Avg.{" "}
          {shouldReveal &&
            (
              usersJoined.reduce((acc, curr) => {
                if (curr.vote === null) {
                  return acc;
                }
                return acc + curr?.vote;
              }, 0) /
              usersJoined.reduce(
                (acc, curr) => acc + (curr.vote !== null ? 1 : 0),
                0
              )
            ).toFixed(2)}
        </div>
      </div>
    </>
  );
};
