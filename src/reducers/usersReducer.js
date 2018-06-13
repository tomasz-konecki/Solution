import { LOAD_USERS_SUCCESS, LOAD_USERS_FAIL, LOGOUT } from "../constants";

const initialState = {
  users: [],
  currentPage: 1,
  totalPageCount: 1
};

export const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_USERS_SUCCESS:
      return {
        users: action.users.results,
        currentPage: action.users.currentPage,
        totalPageCount: action.users.totalPageCount
      };
    case LOAD_USERS_FAIL:
      return {
        resultBlock: action.resultBlock
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
