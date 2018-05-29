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
  },
  binPem: 0
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

let binPem = (userBlock) => {
  let _pem = 0;

  userBlock.roles.indexOf("Developer") >= 0 ? _pem += 1 : _pem += 0;
  userBlock.roles.indexOf("Human Resources") >= 0 ? _pem += 2 : _pem += 0;
  userBlock.roles.indexOf("Tradesman") >= 0 ? _pem += 4 : _pem += 0;
  userBlock.roles.indexOf("Team Leader") >= 0 ? _pem += 8 : _pem += 0;
  userBlock.roles.indexOf("Manager") >= 0 ? _pem += 16 : _pem += 0;
  userBlock.roles.indexOf("Administrator") >= 0 ? _pem += 32 : _pem += 0;

  return _pem;
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.AUTH_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        ...action.userBlock,
        pem: pem(action.userBlock),
        binPem: binPem(action.userBlock)
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
