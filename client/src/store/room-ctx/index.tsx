import React, {
  createContext,
  Dispatch,
  SetStateAction,
  ReactNode,
  useContext,
  useState,
} from "react";

type TimerState = {
  seconds: number;
  minutes: number;
  isActive: boolean;
};

type RoomState = {
  values: {
    selectedCard: number | null;
    disableSubmitButton: boolean;
    shouldReveal: boolean;
    usersJoined: Users;
    linkCopied: boolean;
    timer: TimerState;
  };
  actions: {
    setSelectedCard: Dispatch<SetStateAction<number | null>>;
    setDisableSubmitButton: Dispatch<SetStateAction<boolean>>;
    setShouldReveal: Dispatch<SetStateAction<boolean>>;
    setLinkCopied: Dispatch<SetStateAction<boolean>>;
    setUsersJoined: Dispatch<SetStateAction<Users>>;
    setTimer: Dispatch<SetStateAction<TimerState>>;
  };
};

export const RoomContext = createContext<RoomState>({
  values: {
    disableSubmitButton: false,
    linkCopied: false,
    selectedCard: null,
    usersJoined: [],
    shouldReveal: false,
    timer: {
      minutes: 0,
      seconds: 0,
      isActive: false,
    },
  },
  actions: {
    setSelectedCard: (_) => undefined,
    setDisableSubmitButton: (_) => undefined,
    setShouldReveal: (_) => undefined,
    setLinkCopied: (_) => undefined,
    setUsersJoined: (_) => undefined,
    setTimer: (_) => undefined,
  },
});

export const RoomContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [disableSubmitButton, setDisableSubmitButton] = useState(false);
  const [shouldReveal, setShouldReveal] = useState(false);
  const [usersJoined, setUsersJoined] = useState<Users>([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [timer, setTimer] = useState<TimerState>({
    minutes: 0,
    seconds: 0,
    isActive: false,
  });

  return (
    <RoomContext.Provider
      value={{
        values: {
          selectedCard,
          disableSubmitButton,
          shouldReveal,
          usersJoined,
          linkCopied,
          timer,
        },
        actions: {
          setSelectedCard,
          setDisableSubmitButton,
          setShouldReveal,
          setUsersJoined,
          setLinkCopied,
          setTimer,
        },
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomState = () => {
  const context = useContext(RoomContext);
  if (!context)
    throw new Error(
      "useSummary must be used within a VendingMachineSummaryContext"
    );
  return context;
};
