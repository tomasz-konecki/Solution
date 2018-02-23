import { LOAD_USERS_SUCCESS } from "../constants";

const initialState = {
  users: []
};

export const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_USERS_SUCCESS:
      return [...state, { firstName: "John", lastName: "Cleese" }];

    default:
      return state;
  }
};
