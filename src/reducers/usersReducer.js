import { LOAD_USERS_SUCCESS } from "../constants";

const initialState = {
  users: [
    { firstName: "John", lastName: "Cleese" },
    { firstName: "Paul", lastName: "Jones" }
  ]
};

export const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_USERS_SUCCESS:
      return [...state, action.users];

    default:
      return state;
  }
};
