import { GET_TEAMS, GET_USER_CV, GENERATE_REPORT } from "../constants";
import WebApi from "../api";
import { errorCatcher } from "../services/errorsHandler";
import { asyncStarted, asyncEnded } from "./asyncActions";
import { getFolderACreator as getOneDriveFolders } from "./oneDriveActions";
import { getFoldersACreator as getGDriveFolders } from "./gDriveActions";
import storeCreator from "../store";

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
      .then(
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
          })
      )
      .catch(error => {
        dispatch(getUserCv("", false, errorCatcher(error)));
        dispatch(asyncEnded());
      });
  };
};

export const generateReport = (generateReportStatus, generateReportErrors) => {
  return { type: GENERATE_REPORT, generateReportStatus, generateReportErrors };
};
export const generateReportACreator = (
  addList,
  choosenFolder,
  shouldOneDrive,
  pageList
) => {
  return dispatch => {
    const { store } = storeCreator;
    const state = store.getState();
    const token = getOneDriveToken(state);
    const path = getOneDrivePath(state);

    const teamsSheets = {};
    for (let i = 0; i < addList.length; i++) {
      teamsSheets[addList[i].name] = pageList[i].value;
    }

    const currentPath = path + "/" + choosenFolder.name;

    const generateOnOneDrive = shouldOneDrive === "onedrive" ? true : false;
    const generateOnGDrive = !generateOnOneDrive;

    let model = {};
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
    WebApi.reports.post
      .report(model, generateOnGDrive, generateOnOneDrive)
      .then(response => {
        dispatch(generateReport(true, []));
        if (generateOnGDrive)
          dispatch(
            getGDriveFolders(choosenFolder.id, path + "/" + choosenFolder.id)
          );
        else dispatch(getOneDriveFolders(token, currentPath));
      })
      .catch(error => {
        dispatch(generateReport(false, errorCatcher(error)));
      });
  };
};
const getOneDriveToken = state => {
  return state.oneDriveReducer.authCodeToken;
};
const getOneDrivePath = state => {
  return state.oneDriveReducer.path;
};
