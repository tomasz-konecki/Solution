import * as types from '../constants';

const initialState = {
  isAuthenticated: false,
  loading: false
};

export const authReducer = (state = initialState , action) => {
  switch (action.type) {
    case types.AUTH_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        ...action.token_block
      };
    case types.AUTH_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        loading: false
      };
    case types.AUTH_START:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
};
