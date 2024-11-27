export const getIsUserAModerator = (usersJoined: Users) => {
  const userName = JSON.parse(sessionStorage.getItem("persistedUser") ?? "{}")
    ?.name as string;

  return usersJoined?.find(
    (user) => user.userName === userName && user.isModerator
  );
};

export const getCorrectTimeValue = (value: string) => {
  let val = Number(value);
  console.log("val", val);
  if (isNaN(val)) {
    return 0;
  }

  if (val < 0) {
    return 0;
  }

  if (val >= 60) {
    return 59;
  }

  return val;
};
