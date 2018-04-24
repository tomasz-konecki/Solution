import {
  LANGUAGE_CHANGE,
  LANGUAGE_CHANGED
} from "../constants";

const initialState = {
  language: "pl"
};

export const languageReducer = (state = initialState, action) => {
  switch (action.type) {
    case LANGUAGE_CHANGE:
      return {
        ...state,
        type: action.type,
        language: action.language
      };
    case LANGUAGE_CHANGED:
      return {
        ...state,
        type: action.type
      };
    default:
      return state;
  }
};
