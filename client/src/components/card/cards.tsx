import { SingleCard } from "./single-card.tsx";
import { useRoomState } from "../../store/room-ctx";

import "./cards.scss";

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

export const Cards = () => {
  const { actions, values } = useRoomState();
  const { setSelectedCard } = actions;
  const { selectedCard, disableSubmitButton } = values;
  const handleCardClick = (cardId: number) => {
    setSelectedCard(cardId);
  };

  return (
    <div className="cards-container">
      {cardsSet.map((option) => (
        <SingleCard
          key={option.number}
          number={option.number}
          onClick={handleCardClick}
          isSelected={selectedCard === option.number}
          isDisabled={disableSubmitButton && selectedCard !== option.number}
        />
      ))}
    </div>
  );
};
