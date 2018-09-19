import {
  GET_TEAMS,
  GET_USER_CV,
  GENERATE_REPORT,
  invalidTokenError,
  GET_FAVORITE_AND_RECENT_REPORTS,
  ASYNC_STARTED,
  UNFAVORITE_REPORT
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
export const getRecentAndFavoriteReports = (
  reports,
  reportsStatus,
  reportsErrors) => ({
    type: GET_FAVORITE_AND_RECENT_REPORTS,
    reports,
    reportsStatus,
    reportsErrors
  })
export const getRecentAndFavoriteReportsACreator = numberOfReports => dispatch => {
  dispatch(asyncStarted());
  WebApi.reports.get.recentReports(numberOfReports)
    .then(response => {
      dispatch(
        getRecentAndFavoriteReports(response.replyBlock.data.dtoObject, true, [])
      );
      dispatch(asyncEnded());
    })
    .catch(error => {
      dispatch(
        getRecentAndFavoriteReports([], false, errorCatcher(error))
      );
      dispatch(asyncEnded());
    })
}

export const unfavoriteReport = (
  unfavoriteStatus,
  unfavoriteErrors
) => ({
  type: UNFAVORITE_REPORT,
  unfavoriteStatus,
  unfavoriteErrors
})
export const unfavoriteReportAPromise = (reportId) => (dispatch) => {
  return new Promise((resolve, reject) => {
    WebApi.reports.delete.report(reportId).then(response => {
      dispatch(
        unfavoriteReport(true, [])
      );
      dispatch(asyncEnded());
      resolve(response);
    }).catch(error => {
      dispatch(
        unfavoriteReport(false, errorCatcher(error))
      );
      reject(error);
    })
  })
}
export const unfavoriteReportACreator = reportId => {
  return dispatch => {
    dispatch(asyncStarted());
    unfavoriteReportAPromise(reportId)(dispatch).then(response => {
      getRecentAndFavoriteReportsACreator(5)(dispatch);
    });
  }
}

export const generateReport = (generateReportStatus, generateReportErrors) => {
  return { type: GENERATE_REPORT, generateReportStatus, generateReportErrors };
};
export const generateReportACreator = (
  addList,
  choosenFolder,
  pageList,
  history,
  saveAsFavorite,
  availableUntil
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
          oneDrivePath: currentPath,
          saveAsFavorite: saveAsFavorite,
          availableUntil: availableUntil
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
        getRecentAndFavoriteReportsACreator(5);
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