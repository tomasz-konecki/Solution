import {
  ACCOUNT_CAN_SEARCH_USERS_ACCOUNTS,
  ACCOUNT_CAN_CHANGE_USERS_ROLES,
  ACCOUNT_CAN_SEARCH_AD,
  ACCOUNT_CAN_ADD_USER,
  ACCOUNT_CAN_REACTIVATE_USER,
  ACCOUNT_CAN_DELETE_USER,
  ACCOUNT_CAN_DELETE_USER_REQUEST,
  PROJECT_CAN_SEARCH_PROJECTS,
  CLIENT_GET_LIST_OF_CLIENTS,
  CLIENT_POST_CLIENT,
  CLIENT_DELETE_CLIENT,
  CLIENT_EDIT_CLIENT,
  CLIENT_REACTIVATE_CLIENT
} from "../constants";
import { updateObject } from "../services/methods";

const initialState = {
  account: {
    searchUserAccounts: {
      status: false,
      loading: true
    },
    editUsersRoles: {
      status: false,
      loading: true
    },
    canSearchAD: {
      status: false,
      loading: true
    },
    addUser: {
      status: false,
      loading: true
    },
    canReactivateUser: {
      status: false,
      loading: true
    },
    canDeleteUser: {
      status: false,
      loading: true
    },
    canDeleteUserRequest: {
      status: false,
      loading: true
    }
  },
  projects: {
    searchProjects: {
      status: false,
      loading: true
    }
  },
  client: {
    getListOfClients: {
      status: false,
      loading: true
    },
    addingClient: {
      status: false,
      loading: true
    },
    deleteClient: {
      status: false,
      loading: true
    },
    editClient: {
      status: false,
      loading: true
    },
    reactivateClient: {
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
          ...state.account,
          searchUserAccounts: { status: action.status, loading: action.loading }
        }
      });
    case ACCOUNT_CAN_CHANGE_USERS_ROLES:
      return updateObject(state, {
        account: {
          ...state.account,
          editUsersRoles: { status: action.status, loading: action.loading }
        }
      });
    case ACCOUNT_CAN_SEARCH_AD:
      return updateObject(state, {
        account: {
          ...state.account,
          canSearchAD: { status: action.status, loading: action.loading }
        }
      });
    case ACCOUNT_CAN_ADD_USER:
      return updateObject(state, {
        account: {
          ...state.account,
          addUser: { status: action.status, loading: action.loading }
        }
      });
    case ACCOUNT_CAN_REACTIVATE_USER:
      return updateObject(state, {
        account: {
          ...state.account,
          canReactivateUser: { status: action.status, loading: action.loading }
        }
      });
    case ACCOUNT_CAN_DELETE_USER:
      return updateObject(state, {
        account: {
          ...state.account,
          canDeleteUser: { status: action.status, loading: action.loading }
        }
      });
    case ACCOUNT_CAN_DELETE_USER_REQUEST:
      return updateObject(state, {
        account: {
          ...state.account,
          canDeleteUserRequest: {
            status: action.status,
            loading: action.loading
          }
        }
      });

    case PROJECT_CAN_SEARCH_PROJECTS:
      return updateObject(state, {
        projects: {
          ...state.projects,
          searchProjects: { status: action.status, loading: action.loading }
        }
      });
    case CLIENT_GET_LIST_OF_CLIENTS:
      return updateObject(state, {
        client: {
          ...state.client,
          getListOfClients: { status: action.status, loading: action.loading }
        }
      });
    case CLIENT_POST_CLIENT:
      return updateObject(state, {
        client: {
          ...state.client,
          addingClient: { status: action.status, loading: action.loading }
        }
      });
    case CLIENT_DELETE_CLIENT:
      return updateObject(state, {
        client: {
          ...state.client,
          deleteClient: { status: action.status, loading: action.loading }
        }
      });
    case CLIENT_EDIT_CLIENT:
      return updateObject(state, {
        client: {
          ...state.client,
          editClient: { status: action.status, loading: action.loading }
        }
      });
    case CLIENT_REACTIVATE_CLIENT:
      return updateObject(state, {
        client: {
          ...state.client,
          reactivateClient: { status: action.status, loading: action.loading }
        }
      });
    default:
      return state;
  }
};
