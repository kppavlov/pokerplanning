import { useRoomState } from "../../../store/room-ctx";

export const ResultContainer = () => {
  const { values } = useRoomState();
  const { usersJoined, shouldReveal } = values;

  return (
    <div className="average-container">
      {shouldReveal ? <h1>Avg.</h1> : <h1>No result yet</h1>}
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
  );
};
