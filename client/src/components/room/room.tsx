import { useSocketConnection } from "../../hooks/useSocketConnection";
import { Card } from "../card/card";
import { useEffect, useState } from "react";

const cardsSet = [
  { number: 0 },
  { number: 1 },
  { number: 2 },
  { number: 3 },
  { number: 5 },
  { number: 8 },
  { number: 13 },
  { number: 20 },
  { number: 40 },
  { number: 100 },
];

export const Room = () => {
  const { usersJoined, socket, roomId } = useSocketConnection();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [shouldReveal, setShouldReveal] = useState(false);

  const handleCardClick = (cardId: number) => {
    setSelectedCard(cardId);
  };

  const handleSubmitVote = () => {
    if (selectedCard === null) {
      return;
    }
    const userName = JSON.parse(sessionStorage.getItem("persistedUser") ?? '')?.name;
    socket?.emit("vote-chosen", { roomId, cardId: selectedCard, userName });
  };

  useEffect(() => {
    if (socket) {
      socket.on("reveal-result", () => {
        setShouldReveal(true);
      });
    }
  }, [socket]);

  return (
    <>
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

      <button onClick={() => socket?.emit("reveal-result", roomId)}>
        Show results
      </button>
      <button onClick={handleSubmitVote}>Submit vote</button>

      <div
        style={{
          display: "flex",
        }}
      >
        <div className="user-list-container">
          <ul>
            <li>User name</li>
            <li>Has voted</li>
            <li>Vote</li>
          </ul>

          {usersJoined.map((user) => (
            <ul key={user.userName}>
              <li>{user.userName}</li>
              <li>{!shouldReveal && user.vote ? "✔" : "???"}</li>
              <li>
                {shouldReveal
                  ? user.vote
                    ? user.vote
                    : "Did not vote"
                  : "???"}
              </li>
            </ul>
          ))}
        </div>

        <div className="average-container">Avg. 50</div>
      </div>
    </>
  );
};
