interface UserProps {
  userName: string;
  id: string;
  vote: number | null;
  isModerator: boolean;
}

type Users = UserProps[];
