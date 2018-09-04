import { GET_TEAMS, GET_USER_CV, GENERATE_REPORT, GET_RECENT_REPORTS  } from "../constants";
import { updateObject } from '../services/methods';

const initialState = {
  recentReports: [],
  recentReportsStatus: null,
  recentReportsErrors: [],

  teams: [],
  loadTeamsResult: null,
  loadTeamsErrors: [],

  userDownloadCVLink: "",
  getUserCVStatus: null,
  getUserCVErrors: [],

  generateReportStatus: null,
  generateReportErrors: []
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
    case GET_RECENT_REPORTS:
          return updateObject(state, { recentReports: action.reports,
            recentReportsStatus: action.recentReportsStatus,
            recentReportsErrors: action.recentReportsErrors
          })
    default:
      return state;
  }
};
