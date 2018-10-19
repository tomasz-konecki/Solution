import {
  ACCOUNT_CAN_SEARCH_USERS_ACCOUNTS,
  PROJECT_CAN_SEARCH_PROJECTS
} from "../constants";
import { updateObject } from "../services/methods";

const initialState = {
  account: {
    searchUserAccounts: {
      status: false,
      loading: true
    }
  },
  projects: {
    searchProjects: {
      status: false,
      loading: true
    }
  }
};

export const infoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACCOUNT_CAN_SEARCH_USERS_ACCOUNTS:
      return updateObject(state, {
        account: {
          searchUserAccounts: { status: action.status, loading: action.loading }
        }
      });
    case PROJECT_CAN_SEARCH_PROJECTS:
      return updateObject(state, {
        projects: {
          searchProjects: { status: action.status, loading: action.loading }
        }
      });
    default:
      return state;
  }
};
