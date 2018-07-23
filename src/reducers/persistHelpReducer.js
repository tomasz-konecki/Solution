import { FETCH_LISTS, CHOOSE_FOLDER_TO_GENERATE_REPORT, G_DRIVE_LOGIN } from "../constants";
import { updateObject } from "../services/methods";

const initialState = {
  addList: [],
  baseList: [],
  helpList: [],
  pagesList: [],
  folderToGenerateReport: null,

  loginStatus: null,
  loginErrors: [],
  redirectUrl: ""
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
    default:
      return state;
  }
};
