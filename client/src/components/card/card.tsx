interface CardProps {
  number: number;
  onClick: (cardId: number) => void;
  isSelected: boolean | null;
}

export const Card = ({ number, onClick, isSelected }: CardProps) => {
  return (
    <div
      className={`card ${isSelected ? "card-selected" : ""}`}
      onClick={() => onClick(number)}
    >
      {number}
    </div>
  );
};
