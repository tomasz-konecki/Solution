import { GET_TEAMS, GENERATE_DEVS_REPORT, GOOGLE_DRIVE_LOG_IN, GET_REPORT, GET_USER_CV  } from "../constants";
import { updateObject } from '../services/methods';

const initialState = {
  teams: [],
  loadTeamsResult: null,
  loadTeamsErrors: [],

  genReportResp: "",
  genReportStatus: null,
  genReportErrors: [],

  getReportDownloadLink: "",
  getReportStatus: null,
  getReportErrors: [],

  gDriveRedirectLink: "",
  gDriveLoginResult: null,
  gDriveLoginErrors: [],

  userDownloadCVLink: "",
  getUserCVStatus: null,
  getUserCVErrors: []
};

export const reportsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TEAMS:
        return updateObject(state, {teams: action.teams, loadTeamsResult: action.loadTeamsResult, 
            loadTeamsErrors: action.loadTeamsErrors})
    case GENERATE_DEVS_REPORT:
        return updateObject(state, { genReportResp: action.genReportResp, 
            genReportStatus: action.genReportStatus, 
            genReportErrors: action.genReportErrors})
    case GET_REPORT:
        return updateObject(state, { getReportDownloadLink: action.getReportDownloadLink, 
          getReportStatus: action.getReportStatus, 
          getReportErrors: action.getReportErrors})
    case GOOGLE_DRIVE_LOG_IN:
        return updateObject(state, { gDriveRedirectLink: action.gDriveRedirectLink,
          gDriveLoginResult: action.gDriveLoginResult, gDriveLoginErrors: action.gDriveLoginErrors})
    case GET_USER_CV:
        return updateObject(state, { userDownloadCVLink: action.userDownloadCVLink,
          getUserCVStatus: action.getUserCVStatus, 
          getUserCVErrors: action.getUserCVErrors})

    default:
      return state;
  }
};
