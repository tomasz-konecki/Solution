import * as types from "../constants";

const initialState = {
  isAuthenticated: false,
  loading: false,
  tokens: {},
  language: "pl"
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.AUTH_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        ...action.userBlock
      };
    case types.AUTH_START:
      return {
        ...state,
        loading: true
      };
    case types.AUTH_STOP:
      return {
        ...state,
        loading: false
      };
    case types.LOGOUT:
      return {
        isAuthenticated: false,
        loading: false,
        tokens: {},
        language: "pl"
      };
    default:
      return state;
  }
};

export default authReducer;
