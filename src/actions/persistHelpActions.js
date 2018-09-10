import { FETCH_LISTS, CHOOSE_FOLDER_TO_GENERATE_REPORT, G_DRIVE_LOGIN, FETCH_FORM_CLIENTS,
    CHANGE_SORT_BY }
from "../constants";
import WebApi from '../api/index';
import { getFolders } from './oneDriveActions';
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


export const fetchFormClients = (fetchedFormClients, fetchStatus, fetchError) => {
    return { type: FETCH_FORM_CLIENTS, fetchedFormClients, fetchStatus, fetchError}
}
export const fetchFormClientsACreator = () => {
    return dispatch => {
        WebApi.clients.get.all().then(response => {
            console.log(response);
            dispatch(fetchFormClients(response.replyBlock.data.dtoObjects, true, []));
        }).catch(error => {
            dispatch(fetchFormClients([], false, errorCatcher(error)));
        });
    }
    
}

export const changeSortBy = driveSortType => {
    return { type: CHANGE_SORT_BY, driveSortType }
}

export const changeSortByACreator = (listToSort, sortType, currentPath) => {
    return dispatch => {
        dispatch(changeSortBy(!sortType));
        dispatch(getFolders(listToSort.reverse(), true, [], currentPath));
    }
}