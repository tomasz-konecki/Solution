import { G_DRIVE_LOGIN, GET_GDRIVE_FOLDERS }
from "../constants";
import WebApi from "../api";
import { errorCatcher } from '../services/errorsHandler';


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

export const getFolders = (folders, getFoldersStatus, getFoldersErrors) => {
    return { type: GET_GDRIVE_FOLDERS, folders, getFoldersStatus, getFoldersErrors }
}

export const getFoldersACreator = folderId => {
    return dispatch => {
        const model = {
            "id": folderId
        }
        WebApi.gDrive.post.getFolders(model).then(response => {
            dispatch(getFolders(response, true, []));
        }).catch(error => {
            dispatch(getFolders([], false, errorCatcher(error)));
        })
    }
}