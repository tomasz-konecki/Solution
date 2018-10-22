import { FETCH_LISTS, CHOOSE_FOLDER_TO_GENERATE_REPORT, G_DRIVE_LOGIN, FETCH_FORM_CLIENTS, PUT_NOTIFICATION_ICON_IN_SIDE_BAR,
  CHANGE_SORT_BY, CREATE_LAST_WATCHED_PERSONS, CHANGE_LINK_BEFORE_REDIRECT, CHANGE_CURRENT_WATCHED_USER } from "../constants";
import { updateObject } from "../services/methods";

const initialState = {
  driveSortType: false,  
  fetchedFormClients: [],
  fetchStatus: null,
  fetchError: [],

  addList: [],
  baseList: [],
  helpList: [],
  pagesList: [],
  folderToGenerateReport: null,

  loginStatus: null,
  loginErrors: [],
  redirectUrl: "",
  lastWatchedPersons: [],

  linkBeforeRedirectToOutlookAuth: "",
  currentWatchedUser: "",

  isNotificationIconInSideBar: false
};

export const persistHelpReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LISTS:
      return updateObject(state, {
        addList: action.addList,
        baseList: action.baseList,
        helpList: action.helpList,
        pagesList: action.pagesList
      });
    case CHOOSE_FOLDER_TO_GENERATE_REPORT:
      return updateObject(state, {
        folderToGenerateReport: action.folderToGenerateReport
      });
    case G_DRIVE_LOGIN:
      return updateObject(state, {
        loginStatus: action.loginStatus,
        loginErrors: action.loginErrors,
        redirectUrl: action.redirectUrl
      });
    case FETCH_FORM_CLIENTS:
      return updateObject(state, { fetchedFormClients: action.fetchedFormClients, fetchStatus: action.fetchStatus,
          fetchError: action.fetchError
      });
    case CHANGE_SORT_BY:
      return updateObject(state, { driveSortType: action.driveSortType })
    case CREATE_LAST_WATCHED_PERSONS:
      return updateObject(state, { lastWatchedPersons: action.lastWatchedPersons});
    case CHANGE_LINK_BEFORE_REDIRECT:
      return updateObject(state, { linkBeforeRedirectToOutlookAuth: action.linkBeforeRedirectToOutlookAuth })
    case CHANGE_CURRENT_WATCHED_USER:
      return updateObject(state, { currentWatchedUser: action.currentWatchedUser });
    case PUT_NOTIFICATION_ICON_IN_SIDE_BAR:
      return updateObject(state, { isNotificationIconInSideBar: action.isNotificationIconInSideBar })
    default:
      return state;
  }
};
