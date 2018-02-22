import { GET_USERS } from "../constants";

const initialState = {
  users: []
};

export const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS:
      return [...state, action.users];

    default:
      return state;
  }
};
