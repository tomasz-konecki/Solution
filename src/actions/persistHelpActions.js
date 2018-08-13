import { FETCH_LISTS, CHOOSE_FOLDER_TO_GENERATE_REPORT, G_DRIVE_LOGIN, FETCH_FORM_CLIENTS }
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
            console.log(response.replyBlock.data.dtoObject);
            const { redirectUri } = response.replyBlock.data.dtoObject;
            dispatch(login(true, [], redirectUri));
        }).catch(error => {
            dispatch(login(false, errorCatcher(error), ""));
        })
    }
}


export const fetchFormClients = (fetchedFormClients, fetchStatus, fetchError) => {
    return { type: FETCH_FORM_CLIENTS, fetchedFormClients, fetchStatus, fetchError}
}
export const fetchFormClientsACreator = () => {
    return dispatch => {
        WebApi.clients.get.all().then(response => {
            dispatch(fetchFormClients(response.replyBlock.data.dtoObjects, true, []));
        }).catch(error => {
            dispatch(fetchFormClients([], false, errorCatcher(error)));
        });
    }
    
}