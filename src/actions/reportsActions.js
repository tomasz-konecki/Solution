
import { GET_TEAMS, GET_USER_CV, GENERATE_REPORT, invalidTokenError }
  from "../constants";
import WebApi from "../api";
import { errorCatcher } from "../services/errorsHandler";
import { asyncStarted, asyncEnded } from "./asyncActions";

import { getFolderACreator as getOneDriveFolders, authOneDriveACreator } from './oneDriveActions';
import { getFoldersACreator as getGDriveFolders } from './gDriveActions';
import storeCreator from '../store';
import { clearAfterTimeByFuncRef } from '../services/methods';
import { sendTokenToGetAuth } from './authActions';


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
    return { type: GENERATE_REPORT, generateReportStatus, generateReportErrors }
}
export const generateReportACreator = (addList, choosenFolder, pageList, history) => {
    return dispatch => {
        const { store }  = storeCreator;
        const state = store.getState();
        const token = getOneDriveToken(state);
        const path = getOneDrivePath(state);
        
        const teamsSheets = {};
        for(let i = 0; i < addList.length; i++){
            teamsSheets[addList[i].name] = pageList[i].value;
        }
        const currentPath = choosenFolder.parentPath + "/" + choosenFolder.name;
        const generateOnOneDrive = choosenFolder.parentPath !== undefined ? true : false;
        const generateOnGDrive = !generateOnOneDrive;
        let model = {};
        if(generateOnGDrive){
            model = {
                "teamsSheets": teamsSheets,
                "folderId": choosenFolder.id
            } 
        }
        else{
            model = {
                "teamsSheets": teamsSheets,
                "folderId": choosenFolder.id,
                "folderName": choosenFolder.name,
                "oneDriveToken": token,
                "oneDrivePath": currentPath
            } 
        }

        WebApi.reports.post.report(model, generateOnGDrive, generateOnOneDrive).then(response => {
          dispatch(generateReport(true, []));
            dispatch(clearAfterTimeByFuncRef(generateReport, 2000, null, []));
            if(generateOnGDrive){
              dispatch(getGDriveFolders(choosenFolder.id, path + "/" + choosenFolder.id));
            }
            
            else{
                dispatch(getOneDriveFolders(token, currentPath));
                if(history.location.pathname !== "/main/reports/onedrive")
                    history.push("/main/reports/onedrive");
            }
            
        }).catch(error => {
            dispatch(generateReport(false, errorCatcher(error)));
            dispatch(clearAfterTimeByFuncRef(generateReport, 5000, null, [])); 
        })
    }
}
const getOneDriveToken = state => { return state.authReducer.oneDriveToken }
const getOneDrivePath = state => { return state.oneDriveReducer.path } 

