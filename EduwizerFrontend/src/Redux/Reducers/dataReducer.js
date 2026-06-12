const DEFAULT_STATE = {
  loginData: undefined,
  profileData: undefined,
};

const dataReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case "loginData":
      return {
        ...state,
        loginData: action.payload,
      };
    case "profileData":
      return {
        ...state,
        profileData: action.payload,
      };
    case "logout":
      return {
        ...DEFAULT_STATE
      }
    default:
      return state;
  }
};

export default dataReducer;
