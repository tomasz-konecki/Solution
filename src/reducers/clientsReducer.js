import {
  LOAD_CLIENTS_SUCCESS,
  LOAD_CLIENTS_FAIL,
  ADD_CLIENT_RESULT,
  ADD_CLOUD_RESULT,
  ADD_RESPONSIBLE_PERSON_RESULT,
  CLEAR_RESPONSE_CLOUD,
  LOGOUT
} from "../constants";

const initialState = {
  clients: []
};

export const clientsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_RESPONSE_CLOUD:
      return {
        ...state,
        resultBlockCloud: null
      };
    case ADD_CLOUD_RESULT:
      return {
        ...state,
        resultBlockCloud: action.resultBlock
      };
    case ADD_RESPONSIBLE_PERSON_RESULT:
      return {
        ...state,
        resultBlockResponsiblePerson: action.resultBlock
      };
    case LOAD_CLIENTS_SUCCESS:
      return {
        ...state,
        clients: action.clients,
        resultBlock: action.resultBlock
      };
    case LOAD_CLIENTS_FAIL:
      return {
        resultBlock: action.resultBlock
      };
    case ADD_CLIENT_RESULT:
      return {
        ...state,
        resultBlockAddClient: action.resultBlock
      };
    case LOGOUT:
      return {
        clients: []
      };
    default:
      return state;
  }
};
