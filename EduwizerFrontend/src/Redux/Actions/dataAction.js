export const loginData = (data) => ({
  type: "loginData",
  payload: data,
});

export const profileDataAction = (data) => ({
  type: "profileData",
  payload: data,
});

export const logoutAction = () => ({
  type: "logout",
});
