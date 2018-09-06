import { GET_TEAMS, GET_USER_CV, GENERATE_REPORT, GET_FAVORITE_AND_RECENT_REPORTS, UNFAVORITE_REPORT  } from "../constants";
import { updateObject } from '../services/methods';

const initialState = {
  reports: [],
  reportsStatus: null,
  reportsErrors: [],

  teams: [],
  loadTeamsResult: null,
  loadTeamsErrors: [],

  userDownloadCVLink: "",
  getUserCVStatus: null,
  getUserCVErrors: [],

  generateReportStatus: null,
  generateReportErrors: [],

  unfavoriteStatus: null,
  unfavoriteErrors: []
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
    case GENERATE_REPORT:
        return updateObject(state, { generateReportStatus: action.generateReportStatus, 
          generateReportErrors: action.generateReportErrors })
    case GET_FAVORITE_AND_RECENT_REPORTS:
          return updateObject(state, { reports: action.reports,
            reportsStatus: action.reportsStatus,
            reportsErrors: action.reportsErrors
          })
    case UNFAVORITE_REPORT:
          return updateObject(state, { unfavoriteStatus: action.unfavoriteStatus, 
            unfavoriteErrors: action.unfavoriteErrors})
    default:
      return state;
  }
};
