import { LOAD_CLIENTS_SUCCESS, LOAD_CLIENTS_FAIL, LOGOUT } from "../constants";

const initialState = {
  clients: []
};

export const clientsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CLIENTS_SUCCESS:
      return {
        clients: action.clients
      };
    case LOAD_CLIENTS_FAIL:
      return {
        resultBlock: action.resultBlock
      };
    case LOGOUT:
      return {
        clients: []
      };
    default:
      return state;
  }
};
