import { G_DRIVE_LOGIN, GET_GDRIVE_FOLDERS } from "../constants";
import { updateObject } from "../services/methods";
const initialState = {
  loginStatus: null,
  loginErrors: [],
  redirectUrl: "",

  folders: [],
  getFoldersStatus: null,
  getFoldersErrors: []
};

export const gDriveReducer = (state = initialState, action) => {
  switch (action.type) {
    case G_DRIVE_LOGIN:
      return updateObject(state, {
        loginStatus: action.loginStatus,
        loginErrors: action.loginErrors,
        redirectUrl: action.redirectUrl
      });
    case GET_GDRIVE_FOLDERS:
      return updateObject(state, { folders: action.folders, 
        getFoldersStatus: action.getFoldersStatus, getFoldersErrors: action.getFoldersErrors })
    default:
      return state;
  }
};
