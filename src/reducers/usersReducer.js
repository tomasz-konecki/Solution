import { LOAD_USERS_SUCCESS, SEARCH_AD_SUCCESS } from "../constants";

const initialState = {
  users: [],
  foundUsers: []
};

export const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_USERS_SUCCESS:
      return {
        ...state,
        users: action.users
      };

    case SEARCH_AD_SUCCESS:
      return {
        ...state,
        foundUsers: action.foundUsers
      };

    default:
      return state;
  }
};
