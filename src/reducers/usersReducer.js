import { LOAD_USERS_SUCCESS, LOAD_USERS_FAIL, LOGOUT, GET_ROLES, CHANGE_ROLES_GET_STATUS, SEND_ROLES_RESULT } from "../constants";

const initialState = {
  users: [],
  currentPage: 1,
  totalPageCount: 1,
  roles: [],
  loadRolesErrors: [],
  loadRolesStatus: false
};

export const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_USERS_SUCCESS:
      return {
        users: action.users.results,
        currentPage: action.users.currentPage,
        totalPageCount: action.users.totalPageCount,
        show: action.show
      };
    case LOAD_USERS_FAIL:
      return {
        resultBlock: action.resultBlock,
        show: action.show
      };
    case LOGOUT:
      return {
        users: [],
        currentPage: 1,
        totalPageCount: 1
      };
    case GET_ROLES:
      return {
        ...state,
        roles: action.roles.names
      };
    case CHANGE_ROLES_GET_STATUS:
      return {
        ...state,
        loadRolesStatus: action.loadRolesStatus,
        loadRolesErrors: action.loadRolesErrors
      };
    case SEND_ROLES_RESULT:
      return {
        ...state,
        resultBlockAddRoles: action.resultBlockAddRoles
      }
    default:
      return state;
  }
};
