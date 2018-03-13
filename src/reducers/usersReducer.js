import { LOAD_USERS_SUCCESS, LOGOUT } from "../constants";

const initialState = {
  users: [],
  currentPage: 1,
  totalPageCount: 1
};

export const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_USERS_SUCCESS:
      return {
        ...state,
        ...action
      };
    case LOGOUT:
      return {
        users: [],
        currentPage: 1,
        totalPageCount: 1
      };
    default:
      return state;
  }
};
