import { FETCH_LISTS, CHOOSE_FOLDER_TO_GENERATE_REPORT, G_DRIVE_LOGIN }
from "../constants";
import WebApi from '../api/index';
import { errorCatcher } from '../services/errorsHandler';
export const fetchLists = (addList, baseList, helpList, pagesList) => {
    return { type: FETCH_LISTS, addList, baseList, helpList, pagesList }
}

export const chooseFolder = folderToGenerateReport => {
    return { type: CHOOSE_FOLDER_TO_GENERATE_REPORT, folderToGenerateReport }
}

export const login = (loginStatus, loginErrors, redirectUrl) => {
    return { type: G_DRIVE_LOGIN, loginStatus, loginErrors, redirectUrl }
}

export const loginACreator = () => {
    return dispatch => {
        WebApi.gDrive.get.login().then(response => {
            const { redirectUri } = response.replyBlock.data.dtoObject;
            dispatch(login(true, [], redirectUri));
        }).catch(error => {
            dispatch(login(false, errorCatcher(error), ""));
        })
    }
}