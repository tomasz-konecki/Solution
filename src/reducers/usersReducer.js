import { LOAD_USERS_SUCCESS, LOGOUT } from "../constants";

const initialState = {
  users: []
};

export const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_USERS_SUCCESS:
      return {
        ...state,
        users: action.users
      };
    case LOGOUT:
      return {
        users: []
      };
    default:
      return state;
  }
};
