import { GET_TEAMS, GET_USER_CV }
  from "../constants";
import WebApi from "../api";
import { errorCatcher } from '../services/errorsHandler';
import { asyncStarted, asyncEnded } from "./asyncActions";
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

export const getUserCv = (userDownloadCVLink, getUserCVStatus, getUserCVErrors) => {
    return {
        type: GET_USER_CV,
        userDownloadCVLink,
        getUserCVStatus,
        getUserCVErrors
    }
}
export const getUserCVACreator = userId => {
    return dispatch => {
        dispatch(asyncStarted());
        WebApi.reports.get.cv("CV_" + userId + ".pdf").then(response => {
            dispatch(getUserCv(response.replyBlock.request.responseURL, true, []));
            dispatch(asyncEnded());
        }).catch(error => {
            dispatch(getUserCv("", false, errorCatcher(error)));
            dispatch(asyncEnded());
        })
    }
}
