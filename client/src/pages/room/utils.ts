export const getIsUserAModerator = (usersJoined: Users) => {
  const userName = JSON.parse(sessionStorage.getItem("persistedUser") ?? "{}")
      ?.name as string;

  return usersJoined?.find(
      (user) => user.userName === userName && user.isModerator
  );
};