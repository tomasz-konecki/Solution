
import { FETCH_LISTS, CHOOSE_FOLDER_TO_GENERATE_REPORT, G_DRIVE_LOGIN, FETCH_FORM_CLIENTS, PUT_NOTIFICATION_ICON_IN_SIDE_BAR,
    CHANGE_SORT_BY, CREATE_LAST_WATCHED_PERSONS, CHANGE_LINK_BEFORE_REDIRECT, CHANGE_CURRENT_WATCHED_USER }
from "../constants";
import WebApi from '../api/index';
import { getFolders } from './oneDriveActions';
import { errorCatcher, errorCatcherForLogin } from '../services/errorsHandler';
import storeCreator from '../store/index';

const { store } = storeCreator;

export const fetchLists = (addList, baseList, helpList, pagesList) => {
  return { type: FETCH_LISTS, addList, baseList, helpList, pagesList };
};

export const chooseFolder = folderToGenerateReport => {
  return { type: CHOOSE_FOLDER_TO_GENERATE_REPORT, folderToGenerateReport };
};

export const login = (loginStatus, loginErrors, redirectUrl) => {
  return { type: G_DRIVE_LOGIN, loginStatus, loginErrors, redirectUrl };
};

export const loginACreator = () => {
  return dispatch => {
    WebApi.gDrive.get
      .login()
      .then(response => {
        const { redirectUri } = response.replyBlock.data.dtoObject;
        dispatch(login(true, [], redirectUri));
      })
      .catch(error => {
        dispatch(login(false, errorCatcher(error), ""));
      });
  };
};

export const fetchFormClients = (
  fetchedFormClients,
  fetchStatus,
  fetchError
) => {
  return {
    type: FETCH_FORM_CLIENTS,
    fetchedFormClients,
    fetchStatus,
    fetchError
  };
};
export const fetchFormClientsACreator = () => {
    return dispatch => {
        WebApi.clients.get.all().then(response => {
            dispatch(fetchFormClients(response.replyBlock.data.dtoObjects, true, []));
        }).catch(error => {
            dispatch(fetchFormClients([], false, errorCatcher(error)));
        });
    }

}

export const changeSortBy = driveSortType => {
  return { type: CHANGE_SORT_BY, driveSortType };
};

export const changeSortByACreator = (listToSort, sortType, currentPath) => {
    return dispatch => {
        dispatch(changeSortBy(!sortType));
        dispatch(getFolders(listToSort.reverse(), true, [], currentPath));
    }
}

export const createLastWatchedPersonsArray = (lastWatchedPersons) => {
    return { type: CREATE_LAST_WATCHED_PERSONS, lastWatchedPersons}
}

const selectLastWatchedPersonsArray = state => state.persistHelpReducer.lastWatchedPersons;


export const createLastWatchedPersonsArrayACreator = employeeId => dispatch => {
  const currentLastWatchedPersonsArray = selectLastWatchedPersonsArray(store.getState());
  const copiedLastWatchedPersonsArray = [...currentLastWatchedPersonsArray];
  const personInWatchedPersonsArrayIndex = copiedLastWatchedPersonsArray.indexOf(employeeId);
  const limitOfPersons = 8;
  if(personInWatchedPersonsArrayIndex === -1){
    copiedLastWatchedPersonsArray.push(employeeId);
  }
  if(copiedLastWatchedPersonsArray.length > limitOfPersons){
    copiedLastWatchedPersonsArray.splice(0, 1);
  }
  dispatch(createLastWatchedPersonsArray(copiedLastWatchedPersonsArray));
}

export const changeLinkBeforeRedirect = (linkBeforeRedirectToOutlookAuth) => {
    return { type: CHANGE_LINK_BEFORE_REDIRECT, linkBeforeRedirectToOutlookAuth }
}

export const changeCurrentWatchedUser = currentWatchedUser => {
    return { type: CHANGE_CURRENT_WATCHED_USER, currentWatchedUser }
}

export const putNotificationIconInSideBar = isNotificationIconInSideBar => {
  console.log(isNotificationIconInSideBar);
  return { type: PUT_NOTIFICATION_ICON_IN_SIDE_BAR, isNotificationIconInSideBar };
}

