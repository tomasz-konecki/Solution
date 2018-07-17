import { GET_TEAMS, GET_USER_CV  } from "../constants";
import { updateObject } from '../services/methods';

const initialState = {
  teams: [],
  loadTeamsResult: null,
  loadTeamsErrors: [],

  userDownloadCVLink: "",
  getUserCVStatus: null,
  getUserCVErrors: []
};

export const reportsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TEAMS:
        return updateObject(state, {teams: action.teams, loadTeamsResult: action.loadTeamsResult, 
            loadTeamsErrors: action.loadTeamsErrors})
    case GET_USER_CV:
        return updateObject(state, { userDownloadCVLink: action.userDownloadCVLink,
          getUserCVStatus: action.getUserCVStatus, 
          getUserCVErrors: action.getUserCVErrors})
    default:
      return state;
  }
};
