import { GET_TEAMS, GENERATE_DEVS_REPORT, GOOGLE_DRIVE_LOG_IN, GET_REPORT  }
  from "../constants";
import WebApi from "../api";
import { errorCatcher } from '../services/errorsHandler';

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
        WebApi.reports.get.teams().then(response => {
            dispatch(getTeams(response.replyBlock.data.dtoObjects, true, []));
        }).catch(error => {
            dispatch(getTeams([], false, errorCatcher(error)))
        })
    }
};

export const googleDriveLogIn = (gDriveRedirectLink, gDriveLoginResult, gDriveLoginErrors) => {
    return {
        type: GOOGLE_DRIVE_LOG_IN,
        gDriveRedirectLink,
        gDriveLoginResult,
        gDriveLoginErrors
    }
}

export const gdriveLoginACreator = () => {
    return dispatch => {
        WebApi.gDrive.get.login().then(response => {
            dispatch(googleDriveLogIn(response.replyBlock.data.dtoObject.redirectUri, true, []));
        }).catch(error => {
            dispatch(googleDriveLogIn("", false, errorCatcher(error)));
        })
    }
}
export const generateDevsReportPromise = (finalObject, shouldGenerateLink) => (dispatch) => {
    return new Promise((resolve, reject) => {
        WebApi.reports.post.report(finalObject, shouldGenerateLink).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        })
    })
}

export const generateDevsReport = (genReportResp, genReportStatus, genReportErrors) => {
    return {
        type: GENERATE_DEVS_REPORT,
        genReportResp,
        genReportStatus,
        genReportErrors
    }
}
export const generateDevsReportACreator = (listOfAddedTeams, listOfPages, shouldGenerateLink) => {
    return dispatch => {
        const objectToSend = {};
        for(let i = 0; i < listOfAddedTeams.length; i++){
            objectToSend[listOfAddedTeams[i].name] = listOfPages[i].value;
        }
        const finalObject = {
            "teamsSheets": objectToSend
        }
        if(shouldGenerateLink){
            dispatch(generateDevsReportPromise(finalObject, false)).then(response => {
                dispatch(generateDevsReport(response.replyBlock.data.dtoObject.filename, true, []));
            }).catch(error => {
                dispatch(generateDevsReport(null, false, errorCatcher(error)));
            })
        }
        else
            dispatch(gdriveLoginACreator());
    }
}

export const getReport = (getReportDownloadLink, getReportStatus, getReportErrors) => {
    return {
        type: GET_REPORT,
        getReportDownloadLink,
        getReportStatus,
        getReportErrors
    }
}
export const getReportACreator = fileName => {
    return dispatch => {
        WebApi.reports.get.report(fileName).then(response => {
            dispatch(getReport(response.replyBlock.request.responseURL, true, []));
        }).catch(error => {
            dispatch(getReport("", false, errorCatcher(error)));
        })
    }
}

