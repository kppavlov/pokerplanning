type HomeInputState = {
  value: string;
  err: boolean;
};

export type CreateJoinInputState = {
  join: HomeInputState;
  create: HomeInputState;
};
