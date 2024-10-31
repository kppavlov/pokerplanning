// COMPONENTS
import { Cards } from "../../components/card/cards.tsx";
import { ActionButtons } from "./components/action-buttons/action-buttons.tsx";
import { ShareLink } from "./components/share-link.tsx";
import { UsersTable } from "./components/users-table/users-table.tsx";

// HOOKS
import { useSocketSubscribe } from "../../hooks/useSocketSubscribe.ts";
import { useJoinRoom } from "../../hooks/useJoinRoom.ts";

export const Room = () => {
  useSocketSubscribe();
  useJoinRoom();

  return (
    <>
      <ShareLink />

      <Cards />

      <ActionButtons />

      <UsersTable />
    </>
  );
};
