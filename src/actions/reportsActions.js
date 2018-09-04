import {
  GET_TEAMS,
  GET_USER_CV,
  GENERATE_REPORT,
  invalidTokenError,
  GET_RECENT_REPORTS,
  ASYNC_STARTED
} from "../constants";
import WebApi from "../api";
import { errorCatcher } from "../services/errorsHandler";
import { asyncStarted, asyncEnded } from "./asyncActions";
import { setIsStarted } from './progressBarActions';
import {
  getFolderACreator as getOneDriveFolders,
  authOneDriveACreator
} from "./oneDriveActions";
import { getFoldersACreator as getGDriveFolders } from "./gDriveActions";
import storeCreator from "../store";
import { clearAfterTimeByFuncRef } from "../services/methods";
import { sendTokenToGetAuth } from "./authActions";
import { chooseFolder } from './persistHelpActions';

export const getTeams = (teams, loadTeamsResult, loadTeamsErrors) => {
  return {
    type: GET_TEAMS,
    teams,
    loadTeamsResult,
    loadTeamsErrors
  };
};

export const getTeamsACreator = () => {
  return dispatch => {
    WebApi.reports.get
      .teams()
      .then(response => {
        dispatch(getTeams(response.replyBlock.data.dtoObjects, true, []));
      })
      .catch(error => {
        dispatch(getTeams([], false, errorCatcher(error)));
      });
  };
};

export const getUserCv = (
  userDownloadCVLink,
  getUserCVStatus,
  getUserCVErrors
) => {
  return {
    type: GET_USER_CV,
    userDownloadCVLink,
    getUserCVStatus,
    getUserCVErrors
  };
};
export const getUserCVACreator = userId => {
  return dispatch => {
    dispatch(asyncStarted());
    WebApi.reports.post
      .cv(userId)
      .then(response => {
        WebApi.reports.get
          .cv("CV_" + userId + ".pdf")
          .then(response => {
            dispatch(
              getUserCv(response.replyBlock.request.responseURL, true, [])
            );
            dispatch(asyncEnded());
          })
          .catch(error => {
            dispatch(getUserCv("", false, errorCatcher(error)));
            dispatch(asyncEnded());
          });
      })
      .catch(error => {
        dispatch(getUserCv("", false, errorCatcher(error)));
        dispatch(asyncEnded());
      });
  };
};
export const getRecentReports = (
  reports, 
  recentReportsStatus, 
  recentReportsErrors) => ({
    type: GET_RECENT_REPORTS,
    reports,
    recentReportsStatus,
    recentReportsErrors
})
export const getRecentReportsACreator = numberOfReports => dispatch => {
  dispatch(asyncStarted());
  WebApi.reports.get.recentReports(numberOfReports)
    .then(response => {
      dispatch(
        getRecentReports(response.replyBlock.data.dtoObjects, true, [])
      );
      dispatch(asyncEnded());
    })
    .catch(error => {
      dispatch(
        getRecentReports([], false, errorCatcher(error))
      );
    })
}

export const generateReport = (generateReportStatus, generateReportErrors) => {
  return { type: GENERATE_REPORT, generateReportStatus, generateReportErrors };
};
export const generateReportACreator = (
  addList,
  choosenFolder,
  pageList,
  history
) => {
  return dispatch => {
    const { store } = storeCreator;
    const state = store.getState();
    const token = getOneDriveToken(state);
    const path = getOneDrivePath(state);
    const parentId = getParentId(state);


    const teamsSheets = {};
    for (let i = 0; i < addList.length; i++) {
      teamsSheets[addList[i].name] = pageList[i].value;
    }
    const currentPath = choosenFolder ? choosenFolder.parentPath + "/" + choosenFolder.name : path;
    const generateOnOneDrive = history.location.pathname.search("onedrive") !== -1 ?
      true : false;

    const generateOnGDrive = !generateOnOneDrive;

    let model = {};
    if (choosenFolder) {
      if (generateOnGDrive) {
        model = {
          teamsSheets: teamsSheets,
          folderId: choosenFolder.id
        };
      } else {
        model = {
          teamsSheets: teamsSheets,
          folderId: choosenFolder.id,
          folderName: choosenFolder.name,
          oneDriveToken: token,
          oneDrivePath: currentPath
        };
      }
    }
    else {
      if (generateOnGDrive) {
        model = {
          teamsSheets: teamsSheets,
          folderId: parentId
        }
      }
      else {
        model = {
          teamsSheets: teamsSheets,
          folderId: null,
          folderName: null,
          oneDriveToken: token,
          oneDrivePath: currentPath
        };
      }

    }
    dispatch(setIsStarted(true, "Generowanie raportu"));
    WebApi.reports.post
      .report(model, generateOnGDrive, generateOnOneDrive)
      .then(response => {
        dispatch(setIsStarted(false, ""));
        dispatch(generateReport(true, []));
        if (generateOnGDrive) {
          dispatch(
            getGDriveFolders(parentId ? parentId : "root", path)
          );
        } else {
          dispatch(getOneDriveFolders(token, currentPath));
        }
      })
      .catch(error => {
        dispatch(setIsStarted(false));
        dispatch(generateReport(false, errorCatcher(error)));
      });
  };
};

const getOneDriveToken = state => {
  return state.authReducer.oneDriveToken;
};
const getOneDrivePath = state => {
  return state.oneDriveReducer.path;
};

const getParentId = state => {
  return state.oneDriveReducer.parentId
}