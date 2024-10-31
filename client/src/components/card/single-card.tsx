interface CardProps {
  number: number;
  onClick: (cardId: number) => void;
  isSelected: boolean | null;
  isDisabled?: boolean;
}

export const SingleCard = ({
  number,
  onClick,
  isSelected,
  isDisabled = false,
}: CardProps) => {
  return (
    <div
      className={`card ${isSelected ? "card-selected" : ""} ${isDisabled ? 'card-disabled' : ''}`}
      onClick={() => !isDisabled && onClick(number)}
    >
      {number}
    </div>
  );
};
