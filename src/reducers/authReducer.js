import * as types from "../constants";

const initialState = {
  isAuthenticated: false,
  loading: false,
  tokens: {},
  language: "pl",
  pem: {
    hasDeveloperAccesss: false,
    hasHumanResourcesAccess: false,
    hasSalesmanAccess: false,
    hasTeamLeaderAccess: false,
    hasManagerAccess: false,
    hasAdministrativeAccess: false
  }
};

let pem = (userBlock) => {
  return {
    hasDeveloperAccesss: userBlock.roles.indexOf("Developer") >= 0,
    hasHumanResourcesAccess: userBlock.roles.indexOf("Human Resources") >= 0,
    hasSalesmanAccess: userBlock.roles.indexOf("Tradesman") >= 0,
    hasTeamLeaderAccess: userBlock.roles.indexOf("Team Leader") >= 0,
    hasManagerAccess: userBlock.roles.indexOf("Manager") >= 0,
    hasAdministrativeAccess: userBlock.roles.indexOf("Administrator") >= 0
  };
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.AUTH_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        ...action.userBlock,
        pem: pem(action.userBlock)
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
